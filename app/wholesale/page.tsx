import { InterestForm } from "@/components/forms/InterestForm";

export const metadata = {
  title: "Wholesale Application | KINFORM",
  description: "Apply to carry KINFORM in your store or showroom.",
};

export default function WholesalePage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <h1 className="font-display text-6xl tracking-tight mb-3">Wholesale Application</h1>
      <p className="text-xl text-[#6F5A47] mb-10">
        Interested in carrying KINFORM? Please fill out the form below and our team will reach out with line sheets and pricing.
      </p>

      <InterestForm defaultType="Wholesale Inquiry" />

      <div className="mt-10 text-sm text-[#6F5A47] border-t border-[#D4C9B8] pt-8">
        <p><strong>Minimum order:</strong> 12 units per style (flexible for first orders)</p>
        <p className="mt-1"><strong>Lead time:</strong> 8–12 weeks from order confirmation</p>
      </div>
    </div>
  );
}
