import nodemailer from 'nodemailer';
import 'dotenv/config';
import { getEnvVar } from '../utils/getEnvVar.js';

const host = getEnvVar('SMTP_HOST');
const port = getEnvVar('SMTP_PORT');
const user = getEnvVar('SMTP_USER');
const password = getEnvVar('SMTP_PASSWORD');
const from = getEnvVar('SMTP_FROM');

const nodemailerConfig = {
  host: host,
  port: Number(port),
  secure: false,
  auth: {
    user: user,
    pass: password,
  },
};

const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = data => {
    const email = { ...data, from: from };
    return transporter.sendMail(email);
};