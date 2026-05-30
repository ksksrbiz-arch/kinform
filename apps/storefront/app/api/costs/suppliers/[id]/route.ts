import { NextRequest } from "next/server";
import { deleteSupplier } from "@/lib/costs";
import { requireProductionAuth } from "@/lib/auth";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireProductionAuth();
  if (denied) return denied;
  const { id } = await params;
  const success = await deleteSupplier(id);
  return Response.json({ success });
}
