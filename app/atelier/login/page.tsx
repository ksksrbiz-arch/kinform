"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";
import { toast } from "sonner";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/atelier";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/production-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      toast.success("Access granted");
      router.push(redirect);
    } else {
      toast.error("Incorrect production password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-8 bg-[#F8F4ED]">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="font-display text-6xl tracking-[-0.03em] mb-2">KINFORM</div>
          <div className="inline-flex items-center gap-2 text-[#B37A5F] text-sm tracking-[0.2em] border border-[#B37A5F]/30 px-4 py-1 rounded-full">
            <Shield size={14} /> PRODUCTION PORTAL
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-[#D4C9B8] p-9 rounded-3xl shadow-sm">
          <div>
            <label className="block text-xs tracking-widest text-[#6F5A47] mb-2">SECURE ACCESS CODE</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-[#D4C9B8] focus:border-[#B37A5F] px-5 py-4 rounded-2xl text-xl tracking-[4px] font-mono placeholder:text-[#D4C9B8]"
              placeholder="••••••••••••"
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-primary w-full py-4 text-base disabled:opacity-60"
          >
            {loading ? "VERIFYING ACCESS..." : "ENTER PRODUCTION AREA"}
          </button>

          <div className="text-center text-[11px] text-[#9A8671] pt-2">
            Authorized personnel only. All activity is logged.
          </div>
        </form>

        <div className="text-center mt-8 text-xs text-[#9A8671]">
          Need access? Contact <span className="font-medium">hello@kinform.studio</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductionLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
