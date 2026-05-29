import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const PRODUCTION_PASSWORD = process.env.PRODUCTION_PASSWORD || "kinform-dev-2026";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password === PRODUCTION_PASSWORD) {
    (await cookies()).set("kinform_prod_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 8, // 8 hours
      path: "/",
    });

    return Response.json({ success: true });
  }

  return Response.json({ success: false }, { status: 401 });
}
