import { NextRequest } from "next/server";
import { getMaterialCosts, createMaterialCost } from "@/lib/costs";
import { requireProductionAuth } from "@/lib/auth";

export async function GET() {
  const denied = await requireProductionAuth();
  if (denied) return denied;
  return Response.json(await getMaterialCosts());
}

export async function POST(request: NextRequest) {
  const denied = await requireProductionAuth();
  if (denied) return denied;
  const body = await request.json();
  const cost = await createMaterialCost(body);
  return Response.json(cost, { status: 201 });
}
