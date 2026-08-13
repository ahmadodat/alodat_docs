import { db } from "@/db";
import { categories } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    await db
      .update(categories)
      .set({
        name: body.name,
        color: body.color || "#3b82f6",
        icon: body.icon || "📄",
      })
      .where(and(eq(categories.id, id), eq(categories.userId, user.userId)));

    const [cat] = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!cat) {
      return Response.json({ error: "التصنيف غير موجود" }, { status: 404 });
    }

    return Response.json({ category: cat });
  } catch (error) {
    console.error("Update category error:", error);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    await db
      .delete(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, user.userId)));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete category error:", error);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
