import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';

const SMTP_HOST = getEnvVar('SMTP_HOST');
const SMTP_PORT = getEnvVar('SMTP_PORT');
const SMTP_USER = getEnvVar('SMTP_USER');
const SMTP_PASSWORD = getEnvVar('SMTP_PASSWORD');
const SMTP_FROM = getEnvVar('SMTP_FROM');

const nodemailerConfig = {
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = (data) => {
  const email = { ...data, from: SMTP_FROM };
  return transport.sendMail(email);
};
