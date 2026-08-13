import { db } from "@/db";
import { persons } from "@/db/schema";
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
      .update(persons)
      .set({
        name: body.name,
        relationship: body.relationship,
        avatar: body.avatar || "👤",
        birthDate: body.birthDate || null,
      })
      .where(and(eq(persons.id, id), eq(persons.userId, user.userId)));

    const [person] = await db
      .select()
      .from(persons)
      .where(eq(persons.id, id))
      .limit(1);

    if (!person) {
      return Response.json({ error: "الفرد غير موجود" }, { status: 404 });
    }

    return Response.json({ person });
  } catch (error) {
    console.error("Update person error:", error);
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
      .delete(persons)
      .where(and(eq(persons.id, id), eq(persons.userId, user.userId)));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete person error:", error);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
