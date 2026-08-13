import { db } from "@/db";
import { documents } from "@/db/schema";
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
      .update(documents)
      .set({
        personId: body.personId || null,
        categoryId: body.categoryId || null,
        categoryName: body.categoryName,
        country: body.country || "jordan",
        issueDate: body.issueDate || null,
        expiryDate: body.expiryDate || null,
        documentNumber: body.documentNumber || null,
        notes: body.notes || null,
      })
      .where(and(eq(documents.id, id), eq(documents.userId, user.userId)));

    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, id))
      .limit(1);

    if (!doc) {
      return Response.json({ error: "الوثيقة غير موجودة" }, { status: 404 });
    }

    return Response.json({ document: doc });
  } catch (error) {
    console.error("Update document error:", error);
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
      .delete(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, user.userId)));

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete document error:", error);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
