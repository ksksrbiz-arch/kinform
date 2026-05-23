"use server";

import { createInquiry, Inquiry } from "./inquiries";
import { InterestType } from "./designs";

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

    // In production you could also trigger Resend email here.

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
