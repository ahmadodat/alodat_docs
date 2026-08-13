import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendExpiryAlertEmail({
  to,
  documentName,
  expiryDate,
  timeRemaining,
}: {
  to: string;
  documentName: string;
  expiryDate: string;
  timeRemaining: string;
}) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject: `تنبيه: اقتراب موعد انتهاء ${documentName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h2 style="color: #d9534f;">تنبيه انتهاء صلاحية وثيقة</h2>
          <p>عزيزي المستخدم،</p>
          <p>نود تذكيرك بأن الوثيقة <strong>(${documentName})</strong> ستنتهي خلال <strong>${timeRemaining}</strong>.</p>
          <p>تاريخ الانتهاء المحدد: <strong>${expiryDate}</strong></p>
          <p>يرجى اتخاذ الإجراء اللازم لتجديدها في أقرب وقت.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777;">هذه رسالة تلقائية، يرجى عدم الرد عليها.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
