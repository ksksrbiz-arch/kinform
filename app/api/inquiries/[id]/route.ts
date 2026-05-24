import { NextRequest } from "next/server";
import { updateInquiry, deleteInquiry, addTaskToInquiry, toggleTask, deleteTask, getAllInquiries } from "@/lib/inquiries";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();

  // Handle task actions + notifications
  if (body.action === "addTask") {
    const updated = await addTaskToInquiry(id, body.description, body.dueDate);

    if (resend && updated) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM || "KINFORM <hello@kinform.studio>",
          to: ["founder@kinform.studio"],
          subject: `New Task Added for ${updated.name}`,
          text: `New follow-up task for inquiry from ${updated.name} (${updated.email}):\n\n"${body.description}"\n\nDue: ${body.dueDate || "No date set"}`,
        });
      } catch (e) { console.error("Resend task notification failed", e); }
    }

    return updated ? Response.json(updated) : Response.json({ error: "Not found" }, { status: 404 });
  }

  if (body.action === "toggleTask") {
    const updated = await toggleTask(id, body.taskId);

    if (resend && updated) {
      const task = (updated.tasks || []).find(t => t.id === body.taskId);
      if (task) {
        try {
          await resend.emails.send({
            from: process.env.RESEND_FROM || "KINFORM <hello@kinform.studio>",
            to: ["founder@kinform.studio"],
            subject: `Task ${task.completed ? "Completed" : "Updated"} — ${updated.name}`,
            text: `Task "${task.description}" for ${updated.name} has been marked as ${task.completed ? "COMPLETED" : "IN PROGRESS"}.`,
          });
        } catch (e) { console.error("Resend task update failed", e); }
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
  const { id } = await params;
  const success = await deleteInquiry(id);
  return Response.json({ success }, { status: success ? 200 : 404 });
}
