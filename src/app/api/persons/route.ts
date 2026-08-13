import { db } from "@/db";
import { persons } from "@/db/schema";
import { getCurrentUser } from "@/lib/auth";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return Response.json({ error: "غير مصرح" }, { status: 401 });
    }

    const personList = await db
      .select()
      .from(persons)
      .where(eq(persons.userId, user.userId))
      .orderBy(persons.createdAt);

    return Response.json({ persons: personList });
  } catch (error) {
    console.error("Get persons error:", error);
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
    const personId = crypto.randomUUID();

    await db.insert(persons).values({
      id: personId,
      userId: user.userId,
      name: body.name,
      relationship: body.relationship,
      avatar: body.avatar || "👤",
      birthDate: body.birthDate || null,
    });

    const [person] = await db
      .select()
      .from(persons)
      .where(eq(persons.id, personId))
      .limit(1);

    return Response.json({ person });
  } catch (error) {
    console.error("Create person error:", error);
    return Response.json({ error: "حدث خطأ" }, { status: 500 });
  }
}
