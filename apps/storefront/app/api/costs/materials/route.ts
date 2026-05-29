import { NextRequest } from "next/server";
import { getMaterialCosts, createMaterialCost } from "@/lib/costs";

export async function GET() {
  return Response.json(await getMaterialCosts());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const cost = await createMaterialCost(body);
  return Response.json(cost, { status: 201 });
}
