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
      subject: `تنبيه انتهاء صلاحية: ${categoryName}`,
      html: `
        <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background-color: #ffffff; padding: 25px; border: 1px solid #eaeaea; border-radius: 8px; color: #222222; text-align: right;">
          
          <!-- العنوان الرئيسي -->
          <div style="border-bottom: 2px solid #f1f1f1; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="margin: 0; font-size: 18px; color: #d9534f;">⚠️ تنبيه اقتراب موعد الانتهاء</h2>
            <p style="margin: 5px 0 0; font-size: 13px; color: #666;">متبقي على انتهاء الوثيقة: <strong style="color: #d9534f;">${timeRemaining}</strong></p>
          </div>

          <p style="font-size: 14px; color: #444; line-height: 1.5; margin-bottom: 15px;">
            عزيزي المستخدم، نود لفت انتباهك إلى أن تفاصيل الوثيقة كالتالي:
          </p>

          <!-- الجدول الأول: بيانات الوثيقة -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; background-color: #fafafa; border-radius: 6px; overflow: hidden;">
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; color: #666; width: 35%;">🏷️ التصنيف</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: bold; color: #0275d8;">${categoryName}</td>
            </tr>
            ${documentNumber ? `
            <tr>
              <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; color: #666;">🔢 رقم الوثيقة</td>
              <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 14px; font-weight: 600; color: #333;">${documentNumber}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 10px 12px; font-size: 13px; color: #666;">📅 تاريخ الانتهاء</td>
              <td style="padding: 10px 12px; font-size: 14px; font-weight: bold; color: #d9534f;">${expiryDate}</td>
            </tr>
          </table>

          <!-- الجدول الثاني: معلومات إضافية -->
          ${(personName || country) ? `
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px; background-color: #fafafa; border-radius: 6px; overflow: hidden;">
            ${personName ? `
            <tr>
              <td style="padding: 10px 12px; ${country ? 'border-bottom: 1px solid #eee;' : ''} font-size: 13px; color: #666; width: 35%;">👤 صاحب الوثيقة</td>
              <td style="padding: 10px 12px; ${country ? 'border-bottom: 1px solid #eee;' : ''} font-size: 14px; font-weight: 600; color: #333;">${personName}</td>
            </tr>` : ''}
            ${country ? `
            <tr>
              <td style="padding: 10px 12px; font-size: 13px; color: #666; width: 35%;">🌍 الدولة</td>
              <td style="padding: 10px 12px; font-size: 14px; font-weight: 600; color: #333;">${country}</td>
            </tr>` : ''}
          </table>` : ''}

          ${notes ? `
          <div style="background-color: #fff9e6; padding: 10px 12px; border-radius: 6px; margin-bottom: 15px; font-size: 13px; color: #8a6d3b;">
            <strong>💡 ملاحظات:</strong> ${notes}
          </div>` : ''}

          <!-- الفوتر -->
          <div style="border-top: 1px solid #f1f1f1; padding-top: 12px; margin-top: 20px; text-align: center; font-size: 11px; color: #888;">
            هذه رسالة تلقائية من نظام Alodat، يرجى عدم الرد.
          </div>

        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
