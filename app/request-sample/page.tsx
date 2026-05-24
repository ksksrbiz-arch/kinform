import { InterestForm } from "@/components/forms/InterestForm";

export const metadata = {
  title: "Request a Sample | KINFORM",
  description: "Request physical samples of the KINFORM debut collection.",
};

export default function RequestSamplePage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <h1 className="font-display text-6xl tracking-tight mb-3">Request a Sample</h1>
      <p className="text-xl text-[#6F5A47] mb-10">
        We’re happy to send physical samples of TETHER, CLASP, and APERTURE to qualified partners and stylists.
      </p>

      <InterestForm defaultType="Early Access List" />

      <p className="text-xs text-[#9A8671] mt-8 text-center">
        Samples are limited. We typically respond within 5 business days.
      </p>
    </div>
  );
}
