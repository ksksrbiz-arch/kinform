"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { interestTypes, type InterestType } from "@/lib/designs";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  type: z.enum(interestTypes as readonly [string, ...string[]]),
  company: z.string().optional(),
  message: z.string().max(500, "Message must be under 500 characters").optional(),
  source: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface InterestFormProps {
  onSuccess?: () => void;
  defaultType?: InterestType;
}

export function InterestForm({ onSuccess, defaultType = "Early Access List" }: InterestFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: defaultType,
      name: "",
      email: "",
      message: "",
    },
  });

  const selectedType = watch("type");
  const showCompany = selectedType === "Wholesale Inquiry" || selectedType === "Production Collaboration";

  const onSubmit = async (data: FormValues) => {
    // TODO: Replace with real Formspree submission
    // Example:
    // const res = await fetch(process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT!, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(data),
    // });

    console.log("KINFORM Interest Form submission (demo):", data);

    // Simulate network
    await new Promise((r) => setTimeout(r, 650));

    toast.success("Thank you. We've received your inquiry.", {
      description: "We'll be in touch within 48 hours.",
      duration: 5000,
    });

    reset();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name">Your Name</label>
          <input id="name" {...register("name")} placeholder="Alex Rivera" className="mt-1.5 w-full" />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" {...register("email")} placeholder="you@studio.com" className="mt-1.5 w-full" />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="type">I am interested in</label>
        <select id="type" {...register("type")} className="mt-1.5 w-full">
          {interestTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {showCompany && (
        <div>
          <label htmlFor="company">Company / Brand Name (optional)</label>
          <input id="company" {...register("company")} placeholder="Your studio or boutique" className="mt-1.5 w-full" />
        </div>
      )}

      <div>
        <label htmlFor="message">Message or additional details</label>
        <textarea
          id="message"
          {...register("message")}
          rows={4}
          placeholder="Tell us a bit about your interest or any specific questions..."
          className="mt-1.5 w-full resize-y min-h-[92px]"
        />
      </div>

      <div>
        <label htmlFor="source" className="text-xs">How did you discover KINFORM? (optional)</label>
        <input id="source" {...register("source")} placeholder="Instagram, a friend, press..." className="mt-1.5 w-full" />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full text-base py-3.5 mt-2 disabled:opacity-70"
      >
        {isSubmitting ? "Sending..." : "Submit Inquiry"}
      </button>

      <p className="text-[11px] text-center text-[#9A8671] tracking-wide pt-1">
        We respect your inbox. Unsubscribe anytime.
      </p>
    </form>
  );
}
