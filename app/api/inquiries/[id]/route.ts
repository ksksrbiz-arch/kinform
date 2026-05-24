import { NextRequest } from "next/server";
import { updateInquiry, deleteInquiry, addTaskToInquiry, toggleTask, deleteTask } from "@/lib/inquiries";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  // Handle task actions
  if (body.action === "addTask") {
    const updated = await addTaskToInquiry(id, body.description, body.dueDate);
    return updated ? Response.json(updated) : Response.json({ error: "Not found" }, { status: 404 });
  }

  if (body.action === "toggleTask") {
    const updated = await toggleTask(id, body.taskId);
    return updated ? Response.json(updated) : Response.json({ error: "Not found" }, { status: 404 });
  }

  if (body.action === "deleteTask") {
    const updated = await deleteTask(id, body.taskId);
    return updated ? Response.json(updated) : Response.json({ error: "Not found" }, { status: 404 });
  }

  // Regular update
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
