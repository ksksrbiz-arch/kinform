"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
    <div className="min-h-[70vh] flex items-center justify-center px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="font-display text-5xl tracking-tight mb-3">KINFORM</div>
          <div className="text-[#9A8671] tracking-[0.15em] text-sm">PRODUCTION PORTAL</div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-[#D4C9B8] p-8 rounded-2xl">
          <div>
            <label className="block text-sm mb-2 text-[#6F5A47]">Production Access Code</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-[#D4C9B8] px-4 py-3 rounded-lg text-lg tracking-widest"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 text-base disabled:opacity-70"
          >
            {loading ? "Verifying..." : "Enter Production Area"}
          </button>

          <p className="text-xs text-center text-[#9A8671]">
            This area is restricted to approved production partners and internal team.
          </p>
        </form>
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
