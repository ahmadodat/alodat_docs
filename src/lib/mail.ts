import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendExpiryAlertEmail({ to, documentName, expiryDate, timeRemaining }) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject: `تنبيه: اقتراب موعد انتهاء صلاحية وثيقة (${documentName})`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>تنبيه انتهاء صلاحية الوثيقة</h2>
          <p>نود تذكيرك بأن وثيقتك <strong>${documentName}</strong> ستنتهي خلال <strong>${timeRemaining}</strong>.</p>
          <p>تاريخ الانتهاء: <strong>${expiryDate}</strong></p>
        </div>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error('Resend error:', error);
    return { success: false, error };
  }
}
