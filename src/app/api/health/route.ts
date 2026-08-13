export const dynamic = "force-dynamic";

export async function GET() {
  // Simple health check without database dependency
  // The app uses MySQL on Hostinger which may not be accessible from all environments
  return Response.json({ ok: true });
}
