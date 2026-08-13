import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { sendExpiryAlertEmail } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { success: false, error: "جميع الحقول مطلوبة" },
        { status: 400 }
      );
    }

    // التحقق مما إذا كان المستخدم موجوداً مسبقاً
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return Response.json(
        { success: false, error: "البريد الإلكتروني مستخدم مسبقاً" },
        { status: 400 }
      );
    }

    // تشفير كلمة المرور باستخدام bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // إدخال المستخدم الجديد في قاعدة البيانات (متطابق مع أعمدة الجدول الحالية)
    await db.insert(users).values({
      email,
      password: hashedPassword,
    });

    // إرسال البريد الترحيبي
    try {
      await sendExpiryAlertEmail({
        to: email,
        categoryName: "حساب جديد",
        expiryDate: "غير محدد",
        timeRemaining: "تفعيل الحساب بنجاح",
        personName: name, // استخدام الاسم المدخل في رسالة البريد فقط
        country: "غير محدد",
        documentNumber: "لا يوجد",
        notes: "تم إنشاء حسابك بنجاح في نظام إدارة الوثائق.",
      });
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return Response.json({
      success: true,
      message: "تم تسجيل الحساب بنجاح",
    });

  } catch (error) {
    console.error("Registration error:", error);
    return Response.json(
      { success: false, error: "حدث خطأ أثناء التسجيل" },
      { status: 500 }
    );
  }
}
