"use client";

import Link from "next/link";

interface AccessoriesCrossSellProps {
  designName: string;
  recommendations?: Array<{ name: string; desc: string }>;
}

export function AccessoriesCrossSell({ 
  designName, 
  recommendations = [
    { name: "Statement Hoops", desc: "Bold yet wearable" },
    { name: "Delicate Drops", desc: "Perfect everyday length" },
    { name: "Textured Studs", desc: "Modern minimal" },
  ] 
}: AccessoriesCrossSellProps) {
  return (
    <div className="mt-12 pt-8 border-t border-[#D4C9B8]">
      <div className="text-center mb-6">
        <div className="uppercase tracking-[0.15em] text-xs text-[#B37A5F] mb-1">COMPLETE THE LOOK</div>
        <h3 className="font-display text-2xl tracking-tight">Pair {designName} with these earrings</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {recommendations.map((item, index) => (
          <Link 
            key={index}
            href="/accessories/earrings" 
            className="block p-5 border border-[#D4C9B8] rounded-2xl hover:border-[#B37A5F] hover:bg-[#F8F4ED] dark:hover:bg-[#252320] transition-all text-center"
          >
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-[#6F5A47] mt-0.5">{item.desc}</div>
            <div className="text-xs text-[#B37A5F] mt-2 tracking-wider">SHOP ACCESSORIES →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
