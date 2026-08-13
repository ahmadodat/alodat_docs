import { db } from "@/db";
import { documents, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendExpiryAlertEmail } from "@/lib/mail";

export async function GET(request: Request) {
  try {
    const allDocuments = await db.select().from(documents);
    const allUsers = await db.select().from(users);
    
    const userMap = new Map(allUsers.map(u => [u.id, u.email]));

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let sentCount = 0;

    for (const doc of allDocuments) {
      if (!doc.expiryDate) continue;

      const expiry = new Date(doc.expiryDate);
      expiry.setHours(0, 0, 0, 0);

      const diffTime = expiry.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 90 || diffDays === 30) {
        const userEmail = userMap.get(doc.userId);
        
        if (userEmail) {
          const timeRemainingText = diffDays === 90 ? "3 أشهر" : "شهر واحد";

          await sendExpiryAlertEmail({
            to: userEmail,
            documentName: doc.documentNumber ? `وثيقة رقم: ${doc.documentNumber}` : "وثيقة بدون رقم",
            expiryDate: expiry.toISOString().split('T')[0],
            timeRemaining: timeRemainingText,
          });

          sentCount++;
        }
      }
    }

    return Response.json({ 
      success: true, 
      message: `تم فحص الوثائق بنجاح وإرسال ${sentCount} تنبيهات.` 
    });

  } catch (error) {
    console.error("Expiry check error:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
