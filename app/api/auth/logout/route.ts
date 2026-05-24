import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  (await cookies()).delete("kinform_prod_auth");
  return NextResponse.json({ success: true });
}
