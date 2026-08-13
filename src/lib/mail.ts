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
        <div dir="rtl" style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); overflow: hidden; border: 1px solid #edf2f7; text-align: right; color: #2d3748;">
          
          <!-- شريط ترويجي مودرن داكن -->
          <div style="background-color: #1a202c; padding: 25px 30px; color: #ffffff;">
            <div style="display: inline-block; background-color: #e53e3e; color: #ffffff; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: bold; letter-spacing: 0.5px; margin-bottom: 10px;">إشعار عاجل</div>
            <h2 style="margin: 0; font-size: 18px; font-weight: 600;">اقتراب موعد انتهاء الوثيقة</h2>
            <p style="margin: 6px 0 0 0; font-size: 13px; color: #a0aec0;">الوقت المتبقي: <span style="color: #f6ad55; font-weight: bold;">${timeRemaining}</span></p>
          </div>

          <!-- محتوى البطاقة -->
          <div style="padding: 30px;">
            <p style="font-size: 14px; color: #4a5568; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">
              عزيزي المستخدم، نود إعلامك بأن الوثيقة التالية مسجلة لديك وتتطلب إجراءً سريعاً لتجديدها:
            </p>

            <!-- الجدول الأول: تفاصيل الوثيقة -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; background-color: #f8fafc; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
              <tr>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #718096; width: 35%;">التصنيف</td>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: bold; color: #3182ce;">${categoryName}</td>
              </tr>
              ${documentNumber ? `
              <tr>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #718096;">رقم الوثيقة</td>
                <td style="padding: 12px 18px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #1a202c;">${documentNumber}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 12px 18px; font-size: 13px; color: #718096;">تاريخ الانتهاء</td>
                <td style="padding: 12px 18px; font-size: 14px; font-weight: bold; color: #e53e3e;">${expiryDate}</td>
              </tr>
            </table>

            <!-- الجدول الثاني: معلومات إضافية -->
            ${(personName || country) ? `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; background-color: #f8fafc; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0;">
              ${personName ? `
              <tr>
                <td style="padding: 12px 18px; ${country ? 'border-bottom: 1px solid #e2e8f0;' : ''} font-size: 13px; color: #718096; width: 35%;">صاحب الوثيقة</td>
                <td style="padding: 12px 18px; ${country ? 'border-bottom: 1px solid #e2e8f0;' : ''} font-size: 14px; font-weight: 600; color: #1a202c;">${personName}</td>
              </tr>` : ''}
              ${country ? `
              <tr>
                <td style="padding: 12px 18px; font-size: 13px; color: #718096; width: 35%;">الدولة</td>
                <td style="padding: 12px 18px; font-size: 14px; font-weight: 600; color: #1a202c;">${country}</td>
              </tr>` : ''}
            </table>` : ''}

            <!-- ملاحظات -->
            ${notes ? `
            <div style="background-color: #fffaf0; border-right: 3px solid #dd6b20; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; color: #9c4221;">
              <strong>ملاحظات:</strong> ${notes}
            </div>` : ''}

            <!-- زر أو توجيه خفيف -->
            <div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid #edf2f7;">
              <p style="font-size: 12px; color: #a0aec0; margin: 0;">
                هذه رسالة تلقائية من نظام <strong>Alodat</strong> — يرجى عدم الرد عليها.
              </p>
            </div>

          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
