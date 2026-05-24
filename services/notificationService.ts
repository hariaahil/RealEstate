import type { Inquiry } from '@/types';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const SENDGRID_TO_EMAIL = process.env.SENDGRID_TO_EMAIL;

export async function sendLeadNotification(inquiry: Inquiry) {
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !SENDGRID_TO_EMAIL) {
    console.info('Lead notification not sent because SendGrid variables are not configured.');
    console.info('Lead details:', inquiry);
    return;
  }

  const payload = {
    personalizations: [
      {
        to: [{ email: SENDGRID_TO_EMAIL }],
        subject: `New inquiry from ${inquiry.buyer_name}`,
      },
    ],
    from: { email: SENDGRID_FROM_EMAIL },
    content: [
      {
        type: 'text/plain',
        value: `A new lead has been received for property ${inquiry.property_id}.

Name: ${inquiry.buyer_name}
Email: ${inquiry.buyer_email}
Phone: ${inquiry.buyer_phone}
Message: ${inquiry.message}
Assigned agent: ${inquiry.assigned_agent_id}
Status: ${inquiry.inquiry_status}
`,
      },
    ],
  };

  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
