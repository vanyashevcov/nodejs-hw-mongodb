import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import fs from 'node:fs/promises';
import Handlebars from 'handlebars';
import jwt from 'jsonwebtoken';
import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import { sendEmail } from '../utils/sendEmail.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/auth.js';
import { TEMPLATES_DIR } from '../constants/index.js';

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
  const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const findSession = (query) => SessionCollection.findOne(query);

export const findUser = (query) => UserCollection.findOne(query);

const verifyEmailPath = path.join(TEMPLATES_DIR, 'verify-email.html');
const appDomain = getEnvVar('APP_DOMAIN');
const jwtSecret = getEnvVar('JWT_SECRET');

export const registerUser = async (data) => {
  const { email, password } = data;
  const user = await findUser({ email });

  if (user) {
    throw createHttpError(409, `Email in use`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await UserCollection.create({
    ...data,
    password: hashPassword,
  });

  const token = jwt.sign({ email }, jwtSecret, {
    expiresIn: '24h',
  });

  const templateSource = await fs.readFile(verifyEmailPath, 'utf-8');
  const template = Handlebars.compile(templateSource);
  const html = template({
    verifyLink: `${appDomain}/auth/verify?token=${token}`,
  });

  const verifyEmail = {
    to: email,
    subject: 'Verify email',
    html,
  };

  // try {
  //   await sendEmail(verifyEmail);
  //   console.log(`Verification email sent to ${email}`);
  // } catch (error) {
  //   console.error(`Failed to send verification email:`, error);
  //   throw createHttpError(500, 'Failed to send verification email');
  // }

  await sendEmail(verifyEmail);

  return newUser;
};

export const verifyUser = (token) => {
  try {
    const { email } = jwt.verify(token, jwtSecret);

    return UserCollection.findOneAndUpdate(
      { email },
      { verify: true }
    );
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath, 'utf-8')
  );

  const template = Handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${appDomain}/reset-password?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};

export const loginUser = async (data) => {
  const { email, password } = data;
  const user = await findUser({ email });

  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  if (!user.verify) {
    throw createHttpError(401, 'Email not verified');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Invalid email or password');
  }

  await SessionCollection.findOneAndDelete({ userId: user._id });

  const session = createSession();

  return SessionCollection.create({
    userId: user._id,
    ...session,
  });
};

export const refreshUser = async ({ refreshToken, sessionId }) => {
  const session = await findSession({ refreshToken, _id: sessionId });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < Date.now()) {
    await SessionCollection.findOneAndDelete({ _id: session._id });
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.findOneAndDelete({ _id: session._id });

  const newSession = createSession();

  // console.log('refreshUser', session);
  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const logoutUser = (sessionId) =>
  SessionCollection.findOneAndDelete({ _id: sessionId });
