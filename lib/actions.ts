"use server";

import { createInquiry, Inquiry, getAllInquiries } from "./inquiries";
import { InterestType } from "./designs";
import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

/**
 * Server Action called by the public InterestForm.
 * Saves the lead and returns success.
 */
export async function submitInquiry(formData: FormData): Promise<{
  success: boolean;
  message: string;
  inquiry?: Inquiry;
}> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const type = formData.get("type") as InterestType;
    const company = (formData.get("company") as string) || undefined;
    const message = (formData.get("message") as string) || undefined;
    const source = (formData.get("source") as string) || undefined;

    if (!name || !email || !type) {
      return { success: false, message: "Missing required fields" };
    }

    const inquiry = await createInquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      type,
      company: company?.trim(),
      message: message?.trim(),
      source: source?.trim(),
    });

    // Send notification email if Resend is configured
    if (resend) {
      try {
        await resend.emails.send({
          from: "KINFORM <hello@kinform.studio>",
          to: ["founder@kinform.studio"], // Change to real email in production
          subject: `New ${type} — ${name}`,
          text: `New inquiry from ${name} (${email})\nType: ${type}\nCompany: ${company || "N/A"}\n\n${message || ""}`,
        });
      } catch (e) {
        console.error("Resend notification failed:", e);
      }
    }

    return {
      success: true,
      message: "Thank you. Your inquiry has been recorded.",
      inquiry,
    };
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again or email hello@kinform.studio directly.",
    };
  }
}

/**
 * Get quick stats for the production dashboard.
 */
export async function getProductionStats() {
  const inquiries = await getAllInquiries();

  const newCount = inquiries.filter((i) => i.status === "new").length;
  const thisWeek = inquiries.filter((i) => {
    const date = new Date(i.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date > weekAgo;
  }).length;

  return {
    totalInquiries: inquiries.length,
    newInquiries: newCount,
    thisWeek,
  };
}

