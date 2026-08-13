import { db } from "@/db";
import { documents, users, persons } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sendExpiryAlertEmail } from "@/lib/mail";

export async function GET(request: Request) {
  try {
    const allDocs = await db.select().from(documents);
    const allUsers = await db.select().from(users);
    const allPersons = await db.select().from(persons);

    for (const doc of allDocs) {
      const user = allUsers.find(u => u.id === doc.userId);
      const person = allPersons.find(p => p.id === doc.personId);
      
      if (user && user.email) {
        const expiry = new Date(doc.expiryDate || Date.now());
        const timeRemainingText = "قريباً جداً";

        // استدعاء دالة الإيميل بالخصائص الجديدة الصحيحة 100%
        await sendExpiryAlertEmail({
          to: user.email,
          categoryName: doc.categoryName || "غير محدد",
          expiryDate: expiry.toISOString().split('T')[0],
          timeRemaining: timeRemainingText,
          personName: person?.name || "غير محدد",
          country: doc.country || "غير محدد",
          documentNumber: doc.documentNumber || "لا يوجد",
          notes: doc.notes || null,
        });
      }
    }

    return Response.json({ success: true, message: "Expiry check completed successfully" });
  } catch (error) {
    console.error("Error in check-expiry route:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
