import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotificationEmail(toEmail: string, subject: string, message: string) {
  try {
    const data = await resend.emails.send({
      from: 'Alodat <onboarding@resend.dev>',
      to: [toEmail],
      subject: subject,
      html: `<div dir="rtl"><p>${message}</p></div>`,
    });

    return { success: true, data };
  } catch (error) {
    return { success: false, error };
  }
}
