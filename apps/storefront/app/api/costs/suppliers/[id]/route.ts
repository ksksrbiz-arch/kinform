import { NextRequest } from "next/server";
import { deleteSupplier } from "@/lib/costs";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const success = await deleteSupplier(id);
  return Response.json({ success });
}
