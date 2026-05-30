/**
 * Server-side compile endpoint. Used by the GitHub Actions governance
 * pipeline to produce the bootstrap artifact in CI without spinning up a
 * browser. Accepts the same VFS payload the client uses.
 */

import { NextResponse } from "next/server";
import { compile } from "@/lib/compiler";
import type { VFS } from "@/lib/vfs";

export const runtime = "nodejs";

interface Body {
  vfs: VFS;
  projectName?: string;
  productionOnly?: boolean;
  note?: string;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body?.vfs?.files || !Array.isArray(body.vfs.files)) {
    return NextResponse.json({ error: "Missing vfs.files[]" }, { status: 400 });
  }

  const artifact = compile(body.vfs, {
    projectName: body.projectName ?? "kinform",
    productionOnly: body.productionOnly ?? false,
    note: body.note,
  });

  return new NextResponse(artifact.pythonSource, {
    status: 200,
    headers: {
      "content-type": "text/x-python; charset=utf-8",
      "content-disposition": `attachment; filename="${artifact.filename}"`,
      "x-kinform-rules-version": artifact.rulesVersion,
      "x-kinform-file-count": String(artifact.fileCount),
      "x-kinform-approved-count": String(artifact.approvedCount),
    },
  });
}
