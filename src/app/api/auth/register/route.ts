import { db } from "@/db";
import { users, categories } from "@/db/schema";
import { createToken } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { sendNotificationEmail } from "@/lib/mail"; // أضفنا استيراد دالة الإرسال

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing.length > 0) {
      return Response.json(
        { error: "البريد الإلكتروني مسجل مسبقاً" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = crypto.randomUUID();

    await db.insert(users).values({
      id: userId,
      email,
      password: hashedPassword,
    });

    // Create default categories
    const defaultCategories = [
      { name: "هوية", color: "#3b82f6", icon: "🆔", isDefault: true },
      { name: "جواز سفر", color: "#10b981", icon: "🛂", isDefault: true },
      { name: "رخصة قيادة", color: "#f59e0b", icon: "🚗", isDefault: true },
      { name: "تأمين", color: "#8b5cf6", icon: "🛡️", isDefault: true },
      { name: "عقود", color: "#ef4444", icon: "📄", isDefault: true },
      { name: "شهادات", color: "#06b6d4", icon: "🎓", isDefault: true },
      { name: "أخرى", color: "#6b7280", icon: "📋", isDefault: true },
    ];

    for (const cat of defaultCategories) {
      await db.insert(categories).values({
        id: crypto.randomUUID(),
        userId,
        ...cat,
      });
    }

    // إرسال البريد الترحيلي عند التسجيل بنجاح
    await sendNotificationEmail(
      email,
      "مرحباً بك في نظام إدارة الوثائق الشخصية",
      "تم إنشاء حسابك وتفعيل الأقسام الافتراضية بنجاح. يمكنك الآن البدء في تنظيم وإدارة وثائقك الشخصية بكل سهولة وأمان عبر منصتنا."
    );

    const token = await createToken(userId, email);

    const response = Response.json({
      success: true,
      user: { id: userId, email },
    });

    response.headers.set(
      "Set-Cookie",
      `auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return Response.json({ error: "حدث خطأ في التسجيل" }, { status: 500 });
  }
}
