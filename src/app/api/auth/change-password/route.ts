import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const currentUserPayload = await getCurrentUser();
    if (!currentUserPayload) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { oldPassword, newPassword } = await request.json();

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, currentUserPayload.userId))
      .limit(1);

    if (!user) {
      return Response.json({ error: "المستخدم غير موجود" }, { status: 404 });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return Response.json(
        { error: "كلمة المرور القديمة غير صحيحة" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, currentUserPayload.userId));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
