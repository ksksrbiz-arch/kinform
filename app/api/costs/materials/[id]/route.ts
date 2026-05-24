import { NextRequest } from "next/server";
import { deleteMaterialCost } from "@/lib/costs";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const success = await deleteMaterialCost(id);
  return Response.json({ success });
}
