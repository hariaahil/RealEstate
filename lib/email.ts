'use server';

import nodemailer from 'nodemailer';

type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASSWORD;
const emailFrom = process.env.EMAIL_FROM || 'HydPropertiesHub <noreply@hydpropertieshub.com>';

const transporter = smtpHost && smtpUser && smtpPass
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })
  : null;

export async function sendEmail(options: EmailOptions) {
  if (!transporter) {
    console.warn('SMTP is not configured. Skipping email:', options.subject, options.to);
    return false;
  }

  try {
    await transporter.sendMail({
      from: emailFrom,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
}
