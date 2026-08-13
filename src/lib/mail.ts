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
      subject: `⚠️ تنبيه عاجل: اقتراب موعد انتهاء وثيقة (${categoryName})`,
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa; padding: 30px; border-radius: 12px; color: #333333; text-align: right;">
          
          <!-- الهيدر -->
          <div style="background: linear-gradient(135deg, #2c3e50, #1a252f); padding: 25px; border-radius: 10px 10px 0 0; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 600;">تنبيه انتهاء الصلاحية</h1>
            <p style="margin: 5px 0 0; font-size: 13px; color: #bdc3c7;">نظام إدارة الوثائق - Alodat</p>
          </div>

          <!-- المحتوى الرئيسي -->
          <div style="background-color: #ffffff; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <p style="font-size: 16px; color: #2c3e50; margin-top: 0;">عزيزي المستخدم،</p>
            <p style="font-size: 15px; color: #555555; line-height: 1.6;">
              نود إعلامك بأن إحدى الوثائق المسجلة في نظامك تقترب من موعد انتهائها خلال <strong style="color: #e74c3c;">${timeRemaining}</strong>.
            </p>

            <!-- بطاقة البيانات -->
            <div style="background-color: #fdfefe; border: 1px solid #e1e8ed; border-radius: 8px; padding: 20px; margin: 20px 0;">
              
              <!-- التصنيف (بارز ومميز) -->
              <div style="padding-bottom: 12px; border-bottom: 1px solid #eee; margin-bottom: 12px;">
                <span style="font-size: 13px; color: #7f8c8d; display: block; margin-bottom: 3px;">🏷️ التصنيف</span>
                <span style="font-size: 16px; font-weight: bold; color: #2980b9;">${categoryName}</span>
              </div>

              ${personName ? `
              <div style="padding-bottom: 12px; border-bottom: 1px solid #eee; margin-bottom: 12px;">
                <span style="font-size: 13px; color: #7f8c8d; display: block; margin-bottom: 3px;">👤 صاحب الوثيقة</span>
                <span style="font-size: 15px; font-weight: 600; color: #2c3e50;">${personName}</span>
              </div>` : ''}

              ${country ? `
              <div style="padding-bottom: 12px; border-bottom: 1px solid #eee; margin-bottom: 12px;">
                <span style="font-size: 13px; color: #7f8c8d; display: block; margin-bottom: 3px;">🌍 الدولة</span>
                <span style="font-size: 15px; font-weight: 600; color: #2c3e50;">${country}</span>
              </div>` : ''}

              ${documentNumber ? `
              <div style="padding-bottom: 12px; border-bottom: 1px solid #eee; margin-bottom: 12px;">
                <span style="font-size: 13px; color: #7f8c8d; display: block; margin-bottom: 3px;">🔢 رقم الوثيقة</span>
                <span style="font-size: 15px; font-weight: 600; color: #2c3e50;">${documentNumber}</span>
              </div>` : ''}

              <div>
                <span style="font-size: 13px; color: #7f8c8d; display: block; margin-bottom: 3px;">📅 تاريخ الانتهاء</span>
                <span style="font-size: 15px; font-weight: bold; color: #c0392b;">${expiryDate}</span>
              </div>
            </div>

            ${notes ? `
            <div style="background-color: #fff9e6; border-right: 4px solid #f1c40f; padding: 12px 15px; border-radius: 4px; margin-bottom: 20px;">
              <p style="margin: 0; font-size: 14px; color: #7f6000;"><strong>💡 ملاحظات:</strong> ${notes}</p>
            </div>` : ''}

            <p style="font-size: 14px; color: #555555; line-height: 1.5; text-align: center; margin-top: 25px;">
              يرجى اتخاذ الإجراء اللازم لتجديد الوثيقة في أقرب وقت لتفادي أي تعطل.
            </p>
          </div>

          <!-- الفوتر -->
          <div style="text-align: center; padding-top: 20px; font-size: 12px; color: #95a5a6;">
            <p style="margin: 0;">هذه رسالة تلقائية من نظام Alodat، يرجى عدم الرد عليها.</p>
          </div>

        </div>
      `,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
