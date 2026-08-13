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
      subject: `تنبيه انتهاء الصلاحية: ${categoryName}`,
      html: `
        <div dir="rtl" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 20px auto; background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.06); border: 1px solid #eaeaea; text-align: right; color: #333333;">
          
          <!-- الهيدر البسيط -->
          <div style="margin-bottom: 25px;">
            <span style="background-color: #fff5f5; color: #e53e3e; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">تنبيه عاجل</span>
            <h2 style="margin: 10px 0 5px 0; font-size: 20px; color: #1a202c; font-weight: 700;">موعد انتهاء وثيقة يقترب</h2>
            <p style="margin: 0; font-size: 14px; color: #718096;">المتبقي على الانتهاء: <strong style="color: #e53e3e;">${timeRemaining}</strong></p>
          </div>

          <!-- الجدول الأول: بيانات الوثيقة -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; background-color: #f7fafc; border-radius: 8px; overflow: hidden;">
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 13px; color: #718096; width: 35%;">التصنيف</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 14px; font-weight: bold; color: #3182ce;">${categoryName}</td>
            </tr>
            ${documentNumber ? `
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 13px; color: #718096;">رقم الوثيقة</td>
              <td style="padding: 12px 16px; border-bottom: 1px solid #edf2f7; font-size: 14px; font-weight: 600; color: #2d3748;">${documentNumber}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 12px 16px; font-size: 13px; color: #718096;">تاريخ الانتهاء</td>
              <td style="padding: 12px 16px; font-size: 14px; font-weight: bold; color: #e53e3e;">${expiryDate}</td>
            </tr>
          </table>

          <!-- الجدول الثاني: البيانات الشخصية -->
          ${(personName || country) ? `
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; background-color: #f7fafc; border-radius: 8px; overflow: hidden;">
            ${personName ? `
            <tr>
              <td style="padding: 12px 16px; ${country ? 'border-bottom: 1px solid #edf2f7;' : ''} font-size: 13px; color: #718096; width: 35%;">صاحب الوثيقة</td>
              <td style="padding: 12px 16px; ${country ? 'border-bottom: 1px solid #edf2f7;' : ''} font-size: 14px; font-weight: 600; color: #2d3748;">${personName}</td>
            </tr>` : ''}
            ${country ? `
            <tr>
              <td style="padding: 12px 16px; font-size: 13px; color: #718096; width: 35%;">الدولة</td>
              <td style="padding: 12px 16px; font-size: 14px; font-weight: 600; color: #2d3748;">${country}</td>
            </tr>` : ''}
          </table>` : ''}

          <!-- ملاحظات إن وجدت -->
          ${notes ? `
          <div style="background-color: #fffaf0; border: 1px solid #feebc8; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; color: #c05621;">
            <strong>ملاحظات:</strong> ${notes}
          </div>` : ''}

          <!-- توجيه -->
          <p style="font-size: 13px; color: #718096; line-height: 1.5; margin: 0 0 20px 0; text-align: center;">
            يرجى مراجعة النظام لتجديد الوثيقة في أقرب وقت ممكن.
          </p>

          <!-- الفوتر -->
          <div style="border-top: 1px solid #edf2f7; padding-top: 15px; text-align: center; font-size: 11px; color: #a0aec0;">
            نظام Alodat لإدارة الوثائق — رسالة تلقائية
          </div>

        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
