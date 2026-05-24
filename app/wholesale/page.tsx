import { InterestForm } from "@/components/forms/InterestForm";

export const metadata = {
  title: "Wholesale Application | KINFORM",
  description: "Apply to carry KINFORM in your store or showroom.",
};

export default function WholesalePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-8 py-16">
      <div className="mb-10">
        <h1 className="font-display text-5xl sm:text-6xl tracking-tight mb-3">Wholesale Application</h1>
        <p className="text-xl text-[#6F5A47]">
          Interested in carrying KINFORM in your store? Fill out the form below and we’ll send line sheets, pricing, and order minimums.
        </p>
      </div>

      <div className="bg-white border border-[#D4C9B8] rounded-3xl p-8 md:p-10">
        <InterestForm defaultType="Wholesale Inquiry" allowAttachments />
      </div>

      <div className="mt-10 text-sm text-[#6F5A47] border-t border-[#D4C9B8] pt-8 space-y-1">
        <p><strong>Minimum first order:</strong> 12 units per style (flexible for launch partners)</p>
        <p><strong>Lead time:</strong> 8–12 weeks</p>
        <p><strong>Payment terms:</strong> 50% deposit, 50% prior to shipment</p>
      </div>
    </div>
  );
}
