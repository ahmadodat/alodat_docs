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
      subject: `تنبيه ذكي: وثيقة ${categoryName} تتطلب اهتمامك`,
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 580px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 8px 30px rgba(0,0,0,0.05); border: 1px solid #eef2f6; overflow: hidden; text-align: right; color: #1e293b;">
          
          <!-- الهيدر المبتكر ذو الشريط الجانبي اللوني -->
          <div style="background-color: #f8fafc; padding: 25px 30px; border-bottom: 1px solid #e2e8f0; display: flex; align-items: center;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="vertical-align: middle;">
                  <div style="font-size: 11px; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 1.2px; margin-bottom: 4px;">نظام الحماية والتوثيق</div>
                  <h2 style="margin: 0; font-size: 19px; font-weight: 700; color: #0f172a;">إشعار استحقاق تجديد</h2>
                </td>
                <td style="text-align: left; vertical-align: middle;">
                  <div style="background: linear-gradient(135deg, #ef4444, #dc2626); color: #ffffff; padding: 6px 14px; border-radius: 30px; font-size: 12px; font-weight: 600; display: inline-block; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.2);">
                    ⏳ ${timeRemaining}
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- محتوى الرسالة -->
          <div style="padding: 30px;">
            <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-top: 0; margin-bottom: 22px;">
              عزيزي المستخدم، نود إخطارك بأن إحدى الوثائق الهامة المسجلة في منصتك تقترب من موعد نهايتها. تفاصيل الوثيقة مدونة أدناه:
            </p>

            <!-- الجدول الأول: تفاصيل الوثيقة الأساسية -->
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; background-color: #fcfcfc; border: 1px solid #edf2f7; border-radius: 10px; overflow: hidden;">
              <tr>
                <td style="padding: 13px 18px; border-bottom: 1px solid #edf2f7; font-size: 13px; color: #64748b; width: 35%; font-weight: 500;">التصنيف</td>
                <td style="padding: 13px 18px; border-bottom: 1px solid #edf2f7; font-size: 14px; font-weight: 700; color: #6366f1;">${categoryName}</td>
              </tr>
              ${documentNumber ? `
              <tr>
                <td style="padding: 13px 18px; border-bottom: 1px solid #edf2f7; font-size: 13px; color: #64748b; font-weight: 500;">رقم الوثيقة</td>
                <td style="padding: 13px 18px; border-bottom: 1px solid #edf2f7; font-size: 14px; font-weight: 600; color: #0f172a;">${documentNumber}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 13px 18px; font-size: 13px; color: #64748b; font-weight: 500;">تاريخ الانتهاء</td>
                <td style="padding: 13px 18px; font-size: 14px; font-weight: 700; color: #ef4444;">${expiryDate}</td>
              </tr>
            </table>

            <!-- الجدول الثاني: البيانات المرتبطة -->
            ${(personName || country) ? `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #fcfcfc; border: 1px solid #edf2f7; border-radius: 10px; overflow: hidden;">
              ${personName ? `
              <tr>
                <td style="padding: 13px 18px; ${country ? 'border-bottom: 1px solid #edf2f7;' : ''} font-size: 13px; color: #64748b; width: 35%; font-weight: 500;">صاحب الوثيقة</td>
                <td style="padding: 13px 18px; ${country ? 'border-bottom: 1px solid #edf2f7;' : ''} font-size: 14px; font-weight: 600; color: #0f172a;">${personName}</td>
              </tr>` : ''}
              ${country ? `
              <tr>
                <td style="padding: 13px 18px; font-size: 13px; color: #64748b; width: 35%; font-weight: 500;">الدولة</td>
                <td style="padding: 13px 18px; font-size: 14px; font-weight: 600; color: #0f172a;">${country}</td>
              </tr>` : ''}
            </table>` : ''}

            <!-- ملاحظات النظام إن وجدت -->
            ${notes ? `
            <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 12px 16px; margin-bottom: 22px;">
              <p style="margin: 0; font-size: 13px; color: #b45309; line-height: 1.5;"><strong>💡 ملاحظة هامة:</strong> ${notes}</p>
            </div>` : ''}

            <!-- زر التفاعل السريع -->
            <div style="text-align: center; margin-top: 25px;">
              <a href="https://alodat.net" style="background: linear-gradient(135deg, #0f172a, #1e293b); color: #ffffff; padding: 13px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block; box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);">تحديث وإدارة الوثائق</a>
            </div>

          </div>

          <!-- الفوتر المطور -->
          <div style="background-color: #f8fafc; padding: 18px 30px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">هذه الرسالة تم إنشاؤها تلقائياً بواسطة نظام Alodat — يرجى عدم الرد.</p>
          </div>

        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
