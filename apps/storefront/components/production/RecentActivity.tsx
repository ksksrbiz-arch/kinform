"use client";

import { useEffect, useState } from "react";
import { Inquiry } from "@/lib/inquiries";
import Link from "next/link";

export function RecentActivity() {
  const [recent, setRecent] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/inquiries")
      .then(res => res.json())
      .then((data: Inquiry[]) => {
        setRecent(data.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-sm text-[#9A8671]">Loading recent activity…</div>;
  }

  if (recent.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg">Recent Activity</h3>
        <Link href="/atelier/inquiries" className="text-sm text-[#B37A5F] hover:underline">View all →</Link>
      </div>

      <div className="space-y-3">
        {recent.map((inq) => (
          <div key={inq.id} className="flex items-center justify-between border border-[#D4C9B8] bg-white rounded-xl px-5 py-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="font-medium">{inq.name}</div>
              <div className="text-[#9A8671] text-xs">{inq.type}</div>
            </div>
            <div className="text-xs text-[#6F5A47]">
              {new Date(inq.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
