import { InterestForm } from "@/components/forms/InterestForm";

export const metadata = {
  title: "Request a Sample | KINFORM",
  description: "Request physical samples of the KINFORM debut collection.",
};

export default function RequestSamplePage() {
  return (
    <div className="max-w-2xl mx-auto px-8 py-16">
      <div className="mb-10">
        <h1 className="font-display text-6xl tracking-tight mb-3">Request a Sample</h1>
        <p className="text-xl text-[#6F5A47]">
          We’re happy to send physical samples of our debut collection to qualified stylists, editors, and retail partners.
        </p>
      </div>

      <div className="bg-white border border-[#D4C9B8] rounded-3xl p-8 md:p-10">
        <InterestForm defaultType="Early Access List" />
      </div>

      <div className="mt-8 text-sm text-[#6F5A47] space-y-1 text-center">
        <p>Samples are limited and sent at our discretion.</p>
        <p>Typical response time: 3–7 business days.</p>
      </div>
    </div>
  );
}
