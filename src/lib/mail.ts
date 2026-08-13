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
      subject: `🛡️ تنبيه نظام Alodat: وثيقة (${categoryName}) تتطلب اتخاذ إجراء`,
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 10px 40px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; overflow: hidden; text-align: right; color: #1e293b;">
          
          <!-- الهيدر الذكي مع خلفية داكنة راقية -->
          <div style="background-color: #0f172a; padding: 35px 40px; color: #ffffff;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="color: #38bdf8; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; display: block; margin-bottom: 6px;">ALODAT SECURITY SYSTEM</span>
                <h1 style="margin: 0; font-size: 22px; font-weight: 600;">تقرير حالة الوثيقة</h1>
              </div>
              <div>
                <span style="background-color: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;">⚠️ عاجل</span>
              </div>
            </div>
            
            <!-- شريط التقدم البصري (Progress Bar) -->
            <div style="margin-top: 25px; background: rgba(255,255,255,0.1); border-radius: 8px; height: 8px; overflow: hidden;">
              <div style="background: linear-gradient(90deg, #f59e0b, #ef4444); width: 85%; height: 100%; border-radius: 8px;"></div>
            </div>
            <p style="margin: 8px 0 0 0; font-size: 12px; color: #94a3b8; text-align: left;">الوقت المتبقي للانتهاء: <strong style="color: #f87171;">${timeRemaining}</strong></p>
          </div>

          <!-- المحتوى الرئيسي -->
          <div style="padding: 35px 40px;">
            <p style="font-size: 15px; color: #475569; margin-top: 0; margin-bottom: 20px; line-height: 1.6;">
              عزيزي المستخدم، رصد نظامنا أن صلاحية إحدى الوثائق الهامة في حسابك تكادت تنتهي. إليك ملخص تفصيلي للوثيقة:
            </p>

            <!-- الجدول الأول: بيانات الوثيقة والإنذار -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
              <tr>
                <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; width: 35%; font-weight: 500;">🏷️ التصنيف</td>
                <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0; font-size: 15px; font-weight: 700; color: #0284c7;">${categoryName}</td>
              </tr>
              ${documentNumber ? `
              <tr>
                <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #64748b; font-weight: 500;">🔢 رقم الوثيقة</td>
                <td style="padding: 14px 20px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a;">${documentNumber}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 14px 20px; font-size: 13px; color: #64748b; font-weight: 500;">📅 تاريخ الانتهاء</td>
                <td style="padding: 14px 20px; font-size: 14px; font-weight: 700; color: #dc2626;">${expiryDate}</td>
              </tr>
            </table>

            <!-- الجدول الثاني: البيانات الشخصية والارتباط -->
            ${(personName || country) ? `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
              ${personName ? `
              <tr>
                <td style="padding: 14px 20px; ${country ? 'border-bottom: 1px solid #e2e8f0;' : ''} font-size: 13px; color: #64748b; width: 35%; font-weight: 500;">👤 صاحب الوثيقة</td>
                <td style="padding: 14px 20px; ${country ? 'border-bottom: 1px solid #e2e8f0;' : ''} font-size: 14px; font-weight: 600; color: #0f172a;">${personName}</td>
              </tr>` : ''}
              ${country ? `
              <tr>
                <td style="padding: 14px 20px; font-size: 13px; color: #64748b; width: 35%; font-weight: 500;">🌍 الدولة</td>
                <td style="padding: 14px 20px; font-size: 14px; font-weight: 600; color: #0f172a;">${country}</td>
              </tr>` : ''}
            </table>` : ''}

            <!-- ملاحظات المتابعة إن وجدت -->
            ${notes ? `
            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-right: 4px solid #f59e0b; padding: 14px 18px; border-radius: 8px; margin-bottom: 25px;">
              <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.5;"><strong>💡 ملاحظات النظام:</strong> ${notes}</p>
            </div>` : ''}

            <!-- زر التفاعل السريع (Call to Action) -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://alodat.net" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);">إدارة وتجديد الوثائق الآن</a>
            </div>

          </div>

          <!-- الفوتر الاحترافي -->
          <div style="background-color: #f8fafc; padding: 20px 40px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">هذه رسالة تنبيه ذكية صادرة عن نظام <strong>Alodat</strong> — يرجى عدم الرد.</p>
          </div>

        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
