import { db } from "@/db";
import { users, documents } from "@/db/schema";
import { sendNotificationEmail } from "@/lib/mail";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// دالة مساعدة لتحويل التاريخ إلى تنسيق YYYY-MM-DD
function formatDate(date: Date): string {
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

  const today = new Date();
  
  // حساب تاريخ بعد 3 أشهر (90 يوماً)
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setDate(today.getDate() + 90);
  
  // حساب تاريخ بعد شهر واحد (30 يوماً)
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setDate(today.getDate() + 30);

  const targetThreeMonthsStr = formatDate(threeMonthsFromNow);
  const targetOneMonthStr = formatDate(oneMonthFromNow);

  const expiringDocs = await db.select()
    .from(documents)
    .leftJoin(users, eq(documents.userId, users.id));

  for (const doc of expiringDocs) {
    if (!doc.documents.expiryDate || !doc.users?.email) continue;

    // توحيد تنسيق تاريخ الانتهاء المخزن في القاعدة للمقارنة السليمة
    const docExpiryStr = doc.documents.expiryDate.trim();
    
    let periodText = "";
    if (docExpiryStr === targetThreeMonthsStr) {
      periodText = "3 أشهر";
    } else if (docExpiryStr === targetOneMonthStr) {
      periodText = "شهر واحد";
    }

    if (periodText) {
      await sendNotificationEmail(
        doc.users.email,
        "تنبيه: اقتراب موعد انتهاء الوثيقة",
        `مرحباً، هذا تذكير بأن وثيقتك (رقم الوثيقة: ${doc.documents.documentNumber || 'غير متوفر'}) ستنتهي خلال ${periodText} (بتاريخ: ${doc.documents.expiryDate}). يرجى اتخاذ الإجراء اللازم والتجديد في أقرب وقت.`
      );
    }
  }

  return NextResponse.json({ success: true });
}
