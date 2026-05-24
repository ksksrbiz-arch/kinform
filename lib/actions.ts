"use server";

import { createInquiry, Inquiry, getAllInquiries } from "./inquiries";
import { InterestType } from "./designs";
import { sendNewInquiryEmail } from "./email";

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

    // Handle file attachments
    const attachments: any[] = [];
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("attachment_") && value instanceof File && value.size > 0) {
        const buffer = Buffer.from(await value.arrayBuffer());
        const base64 = buffer.toString("base64");

        attachments.push({
          id: `att_${Date.now()}_${attachments.length}`,
          name: value.name,
          type: value.type,
          size: value.size,
          data: base64,
        });
      }
    }

    const inquiry = await createInquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      type,
      company: company?.trim(),
      message: message?.trim(),
      source: source?.trim(),
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    // Send professional HTML email notification
    try {
      await sendNewInquiryEmail(inquiry);
    } catch (e) {
      console.error("Email notification failed:", e);
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

