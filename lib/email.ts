/**
 * KINFORM — Professional Email Templates
 * 
 * Uses Resend with clean, branded HTML emails.
 */

import { Resend } from "resend";
import { Inquiry } from "./inquiries";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.RESEND_FROM || "KINFORM <hello@kinform.studio>";

const BRAND = {
  name: "KINFORM",
  color: "#B37A5F",
  text: "#2C2722",
  lightBg: "#F8F4ED",
};

function baseTemplate(content: string, title: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: ${BRAND.text}; background: ${BRAND.lightBg}; margin:0; padding:0; }
        .container { max-width: 560px; margin: 40px auto; background: white; border: 1px solid #D4C9B8; border-radius: 16px; overflow: hidden; }
        .header { background: ${BRAND.text}; color: white; padding: 24px 32px; }
        .header h1 { margin:0; font-size: 24px; letter-spacing: -0.02em; }
        .content { padding: 32px; }
        .footer { padding: 20px 32px; background: #F8F4ED; font-size: 13px; color: #9A8671; }
        .button { display: inline-block; background: ${BRAND.color}; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; font-weight: 500; margin-top: 16px; }
        .meta { color: #6F5A47; font-size: 14px; }
        pre { white-space: pre-wrap; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${BRAND.name}</h1>
        </div>
        <div class="content">
          ${content}
        </div>
        <div class="footer">
          This is an automated notification from KINFORM Production. 
          Reply to this email if you need assistance.
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendNewInquiryEmail(inquiry: Inquiry) {
  if (!resend) return;

  const html = baseTemplate(`
    <h2 style="margin:0 0 16px 0; color:${BRAND.text}">New Inquiry Received</h2>
    <p><strong>${inquiry.name}</strong> (${inquiry.email}) submitted a new <strong>${inquiry.type}</strong>.</p>
    
    ${inquiry.company ? `<p><strong>Company:</strong> ${inquiry.company}</p>` : ''}
    ${inquiry.source ? `<p><strong>Source:</strong> ${inquiry.source}</p>` : ''}

    ${inquiry.message ? `
      <div style="margin-top:20px; padding:16px; background:#F8F4ED; border-radius:12px;">
        <strong>Message</strong><br>
        <pre>${inquiry.message}</pre>
      </div>
    ` : ''}

    <a href="https://kinform.studio/atelier/inquiries" class="button">View in Dashboard →</a>
  `, "New KINFORM Inquiry");

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ["founder@kinform.studio"],
    subject: `New ${inquiry.type} — ${inquiry.name}`,
    html,
  });
}

export async function sendTaskNotificationEmail(inquiry: Inquiry, taskDescription: string, action: "added" | "completed") {
  if (!resend) return;

  const verb = action === "added" ? "New task added" : "Task completed";
  const emoji = action === "added" ? "📋" : "✅";

  const html = baseTemplate(`
    <h2 style="margin:0 0 16px 0;">${emoji} ${verb}</h2>
    <p><strong>${inquiry.name}</strong> (${inquiry.email})</p>
    
    <div style="margin: 20px 0; padding: 16px; background: #F8F4ED; border-radius: 12px; border-left: 4px solid ${BRAND.color};">
      <strong>Task:</strong><br>
      ${taskDescription}
    </div>

    <a href="https://kinform.studio/atelier/inquiries" class="button">Open Inquiry →</a>
  `, `Task ${action === "added" ? "Added" : "Completed"}`);

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ["founder@kinform.studio"],
    subject: `${verb} for ${inquiry.name}`,
    html,
  });
}
