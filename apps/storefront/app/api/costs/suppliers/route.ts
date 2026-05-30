import { NextRequest } from "next/server";
import { getSuppliers, createSupplier } from "@/lib/costs";
import { requireProductionAuth } from "@/lib/auth";

export async function GET() {
  const denied = await requireProductionAuth();
  if (denied) return denied;
  return Response.json(await getSuppliers());
}

export async function POST(request: NextRequest) {
  const denied = await requireProductionAuth();
  if (denied) return denied;
  const body = await request.json();
  const supplier = await createSupplier(body);
  return Response.json(supplier, { status: 201 });
}
