import { NextRequest } from "next/server";
import { getInquiries, createInquiry } from "@/lib/inquiries";
import { requireProductionAuth } from "@/lib/auth";

export async function GET() {
  const denied = await requireProductionAuth();
  if (denied) return denied;

  const inquiries = await getInquiries();
  return Response.json(inquiries);
}

export async function POST(request: NextRequest) {
  const denied = await requireProductionAuth();
  if (denied) return denied;

  const body = await request.json();
  try {
    const newInquiry = await createInquiry(body);
    return Response.json(newInquiry, { status: 201 });
  } catch (e) {
    return Response.json({ error: "Failed to create inquiry" }, { status: 400 });
  }
}
