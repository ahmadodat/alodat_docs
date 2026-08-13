import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendExpiryAlertEmail({
  to,
  categoryName,
  expiryDate,
  timeRemaining,
  personName,
  country,
  documentNumber,
  notes,
}: {
  to: string;
  categoryName: string;
  expiryDate: string;
  timeRemaining: string;
  personName?: string;
  country?: string;
  documentNumber?: string;
  notes?: string | null;
}) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: [to],
      subject: `تنبيه: اقتراب موعد انتهاء وثيقة ${categoryName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; background-color: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #d9534f; margin-top: 0;">تنبيه انتهاء صلاحية وثيقة</h2>
          <p>عزيزي المستخدم،</p>
          <p>نود تذكيرك بأن إحدى الوثائق المسجلة لديك تقترب من موعد انتهائها خلال <strong>${timeRemaining}</strong>.</p>
          
          <div style="background: #ffffff; padding: 15px; border: 1px solid #ddd; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 5px 0; font-size: 15px;">🏷️ <strong>التصنيف:</strong> <span style="color: #0275d8; font-weight: bold;">${categoryName}</span></p>
            ${personName ? `<p style="margin: 5px 0;">👤 <strong>صاحب الوثيقة:</strong> ${personName}</p>` : ''}
            ${country ? `<p style="margin: 5px 0;">🌍 <strong>الدولة:</strong> ${country}</p>` : ''}
            ${documentNumber ? `<p style="margin: 5px 0;">🔢 <strong>رقم الوثيقة:</strong> ${documentNumber}</p>` : ''}
            <p style="margin: 5px 0;">📅 <strong>تاريخ الانتهاء:</strong> <span style="color: #d9534f; font-weight: bold;">${expiryDate}</span></p>
            ${notes ? `<p style="margin: 5px 0;">💡 <strong>ملاحظات:</strong> ${notes}</p>` : ''}
          </div>

          <p>يرجى اتخاذ الإجراء اللازم لتجديدها في أقرب وقت.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #777;">هذه رسالة تلقائية من نظام Alodat، يرجى عدم الرد عليها.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
