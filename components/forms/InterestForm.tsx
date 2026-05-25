"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Link from "next/link";
import { interestTypes, type InterestType } from "@/lib/designs";
import { earrings } from "@/lib/earrings";
import { toast } from "sonner";
import { submitInquiry } from "@/lib/actions";

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
  allowAttachments?: boolean;
  piece?: string; // e.g. "HALTER", "FISHNET", "ACADEMIC" or earring nickname
}

export function InterestForm({ onSuccess, defaultType = "Early Access List", allowAttachments = false, piece }: InterestFormProps) {
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

  const [files, setFiles] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // For rich "Build Your Look" pre-order experience
  const [selectedPiece, setSelectedPiece] = useState<string>("");
  const [selectedEarrings, setSelectedEarrings] = useState<string[]>([]);

  const selectedType = watch("type");
  const isPreOrder = selectedType === "Pre-Order / First Run";
  const showCompany = selectedType === "Wholesale Inquiry" || selectedType === "Production Collaboration";

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("type", data.type);
    if (data.company) formData.append("company", data.company);
    let finalMessage = data.message || "";
    const effectivePiece = piece || (isPreOrder ? selectedPiece : undefined);

    if (effectivePiece) {
      finalMessage = finalMessage ? `${finalMessage}\n\nInterested in: ${effectivePiece}` : `Interested in: ${effectivePiece}`;
    }
    if (finalMessage) formData.append("message", finalMessage);

    // Structured data for pre-order + accessories
    if (effectivePiece) formData.append("piece", effectivePiece);
    if (selectedEarrings.length > 0) {
      formData.append("accessories", selectedEarrings.join(","));
    }
    if (data.source) formData.append("source", data.source);

    // Append files if any
    files.forEach((file, index) => {
      formData.append(`attachment_${index}`, file);
    });

    const result = await submitInquiry(formData);

    if (result.success) {
      if (onSuccess) {
        // Modal usage
        toast.success(result.message, { description: "We'll be in touch within 48 hours." });
        reset();
        setFiles([]);
        onSuccess();
      } else {
        // Public page usage - show nice inline success
        setSubmitted(true);
      }
    } else {
      toast.error(result.message);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-10 px-2">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F8F4ED] dark:bg-[#252320] border border-[#D4C9B8]">
          <span className="text-4xl">✓</span>
        </div>

        <h3 className="font-display text-3xl tracking-[-0.02em]">Thank you — you&apos;re in.</h3>
        
        <p className="mt-3 max-w-sm mx-auto text-[#6F5A47] dark:text-[#C8B8A3]">
          Your spot in the first small-batch production run has been recorded.
          We&apos;ll be in touch within 48 hours with next steps, fabric options, and sizing.
        </p>

        <div className="mt-8 text-left max-w-sm mx-auto border border-[#D4C9B8] rounded-2xl p-5 text-sm">
          <div className="uppercase tracking-[0.15em] text-xs text-[#B37A5F] mb-3">WHAT HAPPENS NEXT</div>
          <ol className="space-y-2 text-[#6F5A47] dark:text-[#C8B8A3]">
            <li>1. We confirm your pre-order and send sizing + fabric choices.</li>
            <li>2. Production begins only after the batch closes (we only make what&apos;s ordered).</li>
            <li>3. Your piece ships in 6–8 weeks.</li>
          </ol>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link href="/accessories/earrings" className="text-xs tracking-wider text-[#B37A5F] hover:underline">COMPLETE THE LOOK → SHOP EARRINGS</Link>
          <Link href="/" className="text-xs tracking-wider text-[#B37A5F] hover:underline">BACK TO HOMEPAGE</Link>
        </div>

        <p className="mt-8 text-[10px] text-[#9A8671] dark:text-[#A38F76]">
          You can also email hello@kinform.studio anytime.
        </p>
      </div>
    );
  }

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

      {/* Rich "Build Your Look" experience for Pre-Order / First Run */}
      {isPreOrder && (
        <div className="rounded-2xl border border-[#D4C9B8] dark:border-[#3A3630] bg-[#F8F4ED]/60 dark:bg-[#252320]/60 p-5 space-y-5">
          <div>
            <label className="text-sm font-medium">Which piece are you pre-ordering?</label>
            <select 
              value={selectedPiece} 
              onChange={(e) => setSelectedPiece(e.target.value)}
              className="mt-1.5 w-full"
              required
            >
              <option value="">— Select a garment —</option>
              <option value="HALTER">HALTER — Crossed-Halter Bustier</option>
              <option value="FISHNET">FISHNET — Fishnet & Chevron Torso Piece</option>
              <option value="ACADEMIC">ACADEMIC — Tiered Corset Ensemble</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Complete the look? (optional earrings — ships immediately)</label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {earrings.slice(0, 8).map((e) => {
                const checked = selectedEarrings.includes(e.slug);
                return (
                  <label 
                    key={e.slug} 
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 cursor-pointer transition ${checked ? "border-[#B37A5F] bg-white dark:bg-[#1F1C19]" : "border-[#D4C9B8] hover:bg-white dark:hover:bg-[#1F1C19]"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(ev) => {
                        if (ev.target.checked) {
                          setSelectedEarrings([...selectedEarrings, e.slug]);
                        } else {
                          setSelectedEarrings(selectedEarrings.filter(s => s !== e.slug));
                        }
                      }}
                      className="accent-[#B37A5F]"
                    />
                    <span>{e.nickname}</span>
                  </label>
                );
              })}
            </div>
            <p className="text-[10px] text-[#9A8671] mt-1.5">You can add more or browse the full collection after submitting.</p>
          </div>
        </div>
      )}

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

      {allowAttachments && (
        <div>
          <label className="text-xs">Attachments (optional)</label>
          <input
            type="file"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setFiles(Array.from(e.target.files));
              }
            }}
            className="mt-1.5 w-full text-sm"
          />
          {files.length > 0 && (
            <div className="mt-1 text-xs text-[#6F5A47]">
              {files.length} file(s) selected
            </div>
          )}
        </div>
      )}

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
