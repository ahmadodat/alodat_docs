import { db } from "@/db";
import { documents } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }

    const docs = await db
      .select()
      .from(documents)
      .where(eq(documents.userId, user.userId))
      .orderBy(documents.createdAt);

    return Response.json({ documents: docs });
  } catch (error) {
    console.error("Get documents error:", error);
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
    const docId = crypto.randomUUID();

    await db.insert(documents).values({
      id: docId,
      userId: user.userId,
      personId: body.personId || null,
      categoryId: body.categoryId || null,
      categoryName: body.categoryName,
      country: body.country || "jordan",
      issueDate: body.issueDate || null,
      expiryDate: body.expiryDate || null,
      documentNumber: body.documentNumber || null,
      notes: body.notes || null,
    });

    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, docId))
      .limit(1);

    return Response.json({ document: doc });
  } catch (error) {
    console.error("Create document error:", error);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
