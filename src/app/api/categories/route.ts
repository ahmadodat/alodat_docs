import { db } from "@/db";
import { categories } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }

    const cats = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, user.userId))
      .orderBy(categories.createdAt);

    return Response.json({ categories: cats });
  } catch (error) {
    console.error("Get categories error:", error);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }

    const body = await request.json();
    const catId = crypto.randomUUID();

    await db.insert(categories).values({
      id: catId,
      userId: user.userId,
      name: body.name,
      color: body.color || "#3b82f6",
      icon: body.icon || "📄",
      isDefault: false,
    });

    const [cat] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, catId))
      .limit(1);

    return Response.json({ category: cat });
  } catch (error) {
    console.error("Create category error:", error);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
