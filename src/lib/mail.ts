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
  personName: string;
  country: string;
  documentNumber: string;
  notes: string | null;
}) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'System <no-reply@alodat.net>',
      to: [to],
      subject: `تنبيه: اقتراب موعد انتهاء وثيقة ${categoryName}`,
      html: `
        <div dir="rtl" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); overflow: hidden; border: 1px solid #eaeaea; text-align: right;">
          
          <!-- شريط علوي ملون يعطي طابع التنبيه -->
          <div style="height: 6px; background: linear-gradient(90deg, #f39c12, #e74c3c);"></div>

          <!-- رأس الرسالة -->
          <div style="padding: 30px 40px 20px; border-bottom: 1px solid #f0f0f0;">
            <div style="display: inline-block; background-color: #fdf3f2; color: #c0392b; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; margin-bottom: 15px;">
              ⏰ تنبيه انتهاء صلاحية
            </div>
            <h2 style="color: #1a1a1a; margin: 0; font-size: 20px; font-weight: 700;">وثيقة تحتاج إلى اهتمامك</h2>
            <p style="color: #666; font-size: 14px; margin-top: 6px; line-height: 1.5;">
              عزيزي المستخدم، نود إعلامك بأن إحدى الوثائق المسجلة في نظامك تقترب من موعد انتهائها.
            </p>
          </div>

          <!-- تفاصيل البيانات بأسلوب بطاقات صفية نظيفة -->
          <div style="padding: 30px 40px;">
            
            <div style="background-color: #fafbfc; border-radius: 10px; padding: 20px; border: 1px solid #edf2f7;">
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7; width: 45%;">
                    <span style="color: #8c9ba5; font-size: 13px; display: block; margin-bottom: 2px;">صاحب الوثيقة</span>
                    <span style="color: #2d3748; font-size: 15px; font-weight: 600;">${personName}</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7; width: 55%;">
                    <span style="color: #8c9ba5; font-size: 13px; display: block; margin-bottom: 2px;">الدولة</span>
                    <span style="color: #2d3748; font-size: 15px; font-weight: 600;">${country}</span>
                  </td>
                </tr>
                
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
                    <span style="color: #8c9ba5; font-size: 13px; display: block; margin-bottom: 2px;">التصنيف</span>
                    <span style="color: #2d3748; font-size: 15px; font-weight: 600;">${categoryName}</span>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #edf2f7;">
                    <span style="color: #8c9ba5; font-size: 13px; display: block; margin-bottom: 2px;">رقم الوثيقة</span>
                    <span style="color: #2d3748; font-size: 15px; font-weight: 600;">${documentNumber}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 0; width: 45%;">
                    <span style="color: #8c9ba5; font-size: 13px; display: block; margin-bottom: 2px;">تاريخ الانتهاء</span>
                    <span style="color: #e74c3c; font-size: 15px; font-weight: 700;">${expiryDate}</span>
                  </td>
                  <td style="padding: 12px 0; width: 55%;">
                    <span style="color: #8c9ba5; font-size: 13px; display: block; margin-bottom: 2px;">الوقت المتبقي</span>
                    <span style="color: #2980b9; font-size: 15px; font-weight: 700;">${timeRemaining}</span>
                  </td>
                </tr>
              </table>

            </div>

            ${notes ? `
              <div style="margin-top: 20px; padding: 15px 20px; background-color: #fff9e6; border-radius: 8px; border-right: 4px solid #f39c12;">
                <p style="margin: 0; font-size: 14px; color: #b7791f; line-height: 1.5;"><strong>ملاحظات:</strong> ${notes}</p>
              </div>
            ` : ''}

            <!-- زر الانتقال -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://alodat.net" style="background-color: #1a202c; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">إدارة الوثائق في النظام</a>
            </div>

          </div>

          <!-- الفوتر -->
          <div style="background-color: #f8fafc; padding: 20px 40px; border-top: 1px solid #eaeaea; text-align: center;">
            <p style="color: #a0aec0; font-size: 12px; margin: 0;">هذه رسالة تلقائية من نظام Alodat — يرجى عدم الرد عليها.</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
