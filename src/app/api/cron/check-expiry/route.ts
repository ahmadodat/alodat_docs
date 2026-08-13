import { db } from "@/db";
import { users, documents } from "@/db/schema";
import { sendNotificationEmail } from "@/lib/mail";
import { eq, and, lt, gte } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // للتحقق من أن الطلب يأتي من مصدر موثوق (اختياري)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  
  // تحديد النطاقات الزمنية (90 يوم = 3 شهور، 30 يوم = شهر)
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setDate(today.getDate() + 90);
  
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setDate(today.getDate() + 30);

  // جلب الوثائق التي تنتهي في هذه التواريخ
  const expiringDocs = await db.select()
    .from(documents)
    .leftJoin(users, eq(documents.userId, users.id));

  for (const doc of expiringDocs) {
    const expiryDate = new Date(doc.documents.expiryDate); // تأكد أن حقل التاريخ موجود في جدولك
    
    // فحص إذا كانت الوثيقة تنتهي قبل 3 شهور أو شهر
    if (expiryDate.toDateString() === threeMonthsFromNow.toDateString() || 
        expiryDate.toDateString() === oneMonthFromNow.toDateString()) {
      
      await sendNotificationEmail(
        doc.users.email,
        "تنبيه: اقتراب انتهاء وثيقة",
        `عزيزي المستخدم، نود تذكيرك بأن وثيقتك "${doc.documents.name}" ستنتهي بتاريخ ${doc.documents.expiryDate}. يرجى اتخاذ الإجراء اللازم.`
      );
    }
  }

  return NextResponse.json({ success: true });
}