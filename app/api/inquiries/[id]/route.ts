import { NextRequest } from "next/server";
import { updateInquiry, deleteInquiry } from "@/lib/inquiries";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  const updated = await updateInquiry(id, body);
  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const success = await deleteInquiry(id);
  return Response.json({ success }, { status: success ? 200 : 404 });
}
