import { db } from "@/db";
import { users, documents } from "@/db/schema";
import { sendNotificationEmail } from "@/lib/mail";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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

  const expiringDocs = await db.select()
    .from(documents)
    .leftJoin(users, eq(documents.userId, users.id));

  for (const doc of expiringDocs) {
    if (!doc.documents.expiryDate || !doc.users?.email) continue;

    const expiryDate = new Date(doc.documents.expiryDate);
    
    // التحقق مما إذا كان تاريخ الانتهاء يوافق تماماً بعد 3 أشهر أو بعد شهر واحد
    if (expiryDate.toDateString() === threeMonthsFromNow.toDateString() || 
        expiryDate.toDateString() === oneMonthFromNow.toDateString()) {
      
      const periodText = expiryDate.toDateString() === threeMonthsFromNow.toDateString() 
        ? "3 أشهر" 
        : "شهر واحد";

      await sendNotificationEmail(
        doc.users.email,
        "تنبيه: اقتراب موعد انتهاء الوثيقة",
        `مرحباً، هذا تذكير بأن وثيقتك (رقم الوثيقة: ${doc.documents.documentNumber || 'غير متوفر'}) ستنتهي خلال ${periodText} (بتاريخ: ${doc.documents.expiryDate}). يرجى اتخاذ الإجراء اللازم والتجديد في أقرب وقت.`
      );
    }
  }

  return NextResponse.json({ success: true });
}
