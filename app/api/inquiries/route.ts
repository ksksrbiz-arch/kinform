import { NextRequest } from "next/server";
import { getInquiries, createInquiry } from "@/lib/inquiries";

export async function GET() {
  const inquiries = await getInquiries();
  return Response.json(inquiries);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  try {
    const newInquiry = await createInquiry(body);
    return Response.json(newInquiry, { status: 201 });
  } catch (e) {
    return Response.json({ error: "Failed to create inquiry" }, { status: 400 });
  }
}
