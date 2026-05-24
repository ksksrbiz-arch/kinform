"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Shield } from "lucide-react";

export function ProductionNav() {
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/atelier/login");
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2 rounded-full bg-[#B37A5F]/10 px-3 py-1 text-[#B37A5F]">
        <Shield size={14} />
        <span className="font-medium text-xs tracking-wider">PRODUCTION MODE</span>
      </div>

      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-1.5 text-[#9A8671] hover:text-[#2C2722] transition-colors disabled:opacity-50"
      >
        <LogOut size={15} />
        <span className="text-xs">Logout</span>
      </button>
    </div>
  );
}
