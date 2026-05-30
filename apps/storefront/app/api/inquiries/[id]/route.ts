import { NextRequest } from "next/server";
import { updateInquiry, deleteInquiry, addTaskToInquiry, toggleTask, deleteTask, getAllInquiries } from "@/lib/inquiries";
import { sendTaskNotificationEmail } from "@/lib/email";
import { requireProductionAuth } from "@/lib/auth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireProductionAuth();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json();

  // Handle task actions + professional notifications
  if (body.action === "addTask") {
    const updated = await addTaskToInquiry(id, body.description, body.dueDate);

    if (updated) {
      try {
        await sendTaskNotificationEmail(updated, body.description, "added");
      } catch (e) { console.error("Task email failed", e); }
    }

    return updated ? Response.json(updated) : Response.json({ error: "Not found" }, { status: 404 });
  }

  if (body.action === "toggleTask") {
    const updated = await toggleTask(id, body.taskId);

    if (updated) {
      const task = (updated.tasks || []).find(t => t.id === body.taskId);
      if (task) {
        try {
          await sendTaskNotificationEmail(updated, task.description, task.completed ? "completed" : "added");
        } catch (e) { console.error("Task email failed", e); }
      }
    }

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
  const denied = await requireProductionAuth();
  if (denied) return denied;

  const { id } = await params;
  const success = await deleteInquiry(id);
  return Response.json({ success }, { status: success ? 200 : 404 });
}
