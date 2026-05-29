import { NextRequest } from "next/server";
import { getSuppliers, createSupplier } from "@/lib/costs";

export async function GET() {
  return Response.json(await getSuppliers());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const supplier = await createSupplier(body);
  return Response.json(supplier, { status: 201 });
}
