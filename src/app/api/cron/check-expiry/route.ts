import { db } from "@/db";
import { users, documents } from "@/db/schema";
import { sendNotificationEmail } from "@/lib/mail";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// دالة لتحويل كاريخ إلى نص YYYY-MM-DD بدقة متناهية وبدون مشاكل توقيت
function formatYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // تاريخ اليوم الحالي بدون ساعات أو دقائق
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // حساب تاريخ بعد 3 أشهر (90 يوماً بالضبط)
  const threeMonthsTarget = new Date(today);
  threeMonthsTarget.setDate(today.getDate() + 90);
  const target3MonthsStr = formatYYYYMMDD(threeMonthsTarget);

  // حساب تاريخ بعد شهر واحد (30 يوماً بالضبط)
  const oneMonthTarget = new Date(today);
  oneMonthTarget.setDate(today.getDate() + 30);
  const target1MonthStr = formatYYYYMMDD(oneMonthTarget);

  const expiringDocs = await db.select()
    .from(documents)
    .leftJoin(users, eq(documents.userId, users.id));

  let sentCount = 0;

  for (const doc of expiringDocs) {
    if (!doc.documents.expiryDate || !doc.users?.email) continue;

    // تنظيف النص وتوحيده للمقارنة
    const docExpiryStr = doc.documents.expiryDate.trim().substring(0, 10);
    
    let periodText = "";
    if (docExpiryStr === target3MonthsStr) {
      periodText = "3 أشهر";
    } else if (docExpiryStr === target1MonthStr) {
      periodText = "شهر واحد";
    }

    if (periodText) {
      await sendNotificationEmail(
        doc.users.email,
        "تنبيه: اقتراب موعد انتهاء الوثيقة",
        `مرحباً، هذا تذكير بأن وثيقتك (رقم الوثيقة: ${doc.documents.documentNumber || 'غير متوفر'}) ستنتهي خلال ${periodText} (بتاريخ: ${doc.documents.expiryDate}). يرجى اتخاذ الإجراء اللازم والتجديد في أقرب وقت.`
      );
      sentCount++;
    }
  }

  return NextResponse.json({ success: true, notificationsSent: sentCount });
}
