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
  
  const threeMonthsFromNow = new Date();
  threeMonthsFromNow.setDate(today.getDate() + 90);
  
  const oneMonthFromNow = new Date();
  oneMonthFromNow.setDate(today.getDate() + 30);

  const expiringDocs = await db.select()
    .from(documents)
    .leftJoin(users, eq(documents.userId, users.id));

  for (const doc of expiringDocs) {
    // إذا لم يكن هناك تاريخ انتهاء، تجاوز هذه الوثيقة لتجنب الخطأ
    if (!doc.documents.expiryDate || !doc.users?.email) continue;

    const expiryDate = new Date(doc.documents.expiryDate);
    
    if (expiryDate.toDateString() === threeMonthsFromNow.toDateString() || 
        expiryDate.toDateString() === oneMonthFromNow.toDateString()) {
      
      await sendNotificationEmail(
        doc.users.email,
        "تنبيه: اقتراب انتهاء وثيقة",
        `عزيزي المستخدم، نود تذكيرك بأن وثيقتك "${doc.documents.name}" ستنتهي بتاريخ الطبع ${doc.documents.expiryDate}. يرجى اتخاذ الإجراء اللازم.`
      );
    }
  }

  return NextResponse.json({ success: true });
}
