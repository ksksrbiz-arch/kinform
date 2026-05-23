"use client";

import { useEffect, useState } from "react";
import { Inquiry, InquiryStatus } from "@/lib/inquiries";
import { interestTypes } from "@/lib/designs";
import { inquiriesToCSV } from "@/lib/csv";
import { toast } from "sonner";

const STATUSES: InquiryStatus[] = ["new", "contacted", "qualified", "closed"];

export default function InquiriesDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const loadInquiries = async () => {
    setLoading(true);
    const data = await fetch("/api/inquiries").then((r) => r.json());
    setInquiries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const filtered = inquiries
    .filter((i) => (statusFilter === "all" ? true : i.status === statusFilter))
    .filter((i) => (typeFilter === "all" ? true : i.type === typeFilter))
    .filter((i) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        i.name.toLowerCase().includes(s) ||
        i.email.toLowerCase().includes(s) ||
        (i.company && i.company.toLowerCase().includes(s))
      );
    });

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    const updated = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    }).then((r) => r.json());

    if (updated) {
      setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast.success(`Marked as ${newStatus}`);
    }
  };

  const startEditing = (inquiry: Inquiry) => {
    setEditingId(inquiry.id);
    setEditNotes(inquiry.notes || "");
  };

  const saveNotes = async (id: string) => {
    const updated = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: editNotes }),
    }).then((r) => r.json());

    if (updated) {
      setInquiries((prev) => prev.map((i) => (i.id === id ? updated : i)));
      setEditingId(null);
      toast.success("Notes saved");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry permanently?")) return;

    await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
    setInquiries((prev) => prev.filter((i) => i.id !== id));
    toast.success("Inquiry deleted");
  };

  const exportCSV = () => {
    const csv = inquiriesToCSV(filtered);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kinform-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs tracking-[0.2em] text-[#9A8671]">INTERNAL • PRODUCTION</div>
          <h1 className="font-display text-6xl tracking-tight">Inquiries Dashboard</h1>
        </div>
        <button onClick={exportCSV} className="btn-secondary">
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl border border-[#D4C9B8]">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="border border-[#D4C9B8] rounded px-3 py-1.5 text-sm"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-[#D4C9B8] rounded px-3 py-1.5 text-sm"
        >
          <option value="all">All Types</option>
          {interestTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search name, email, company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-[#D4C9B8] rounded px-3 py-1.5 text-sm flex-1 min-w-[220px]"
        />

        <button onClick={loadInquiries} className="btn-secondary text-sm">
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-[#9A8671]">Loading inquiries…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-[#9A8671] border border-dashed rounded-xl">
          No inquiries match your filters.
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#D4C9B8] rounded-xl bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[#F1E9DF] text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Name / Email</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Company</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 font-medium w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4C9B8]">
              {filtered.map((inq) => (
                <tr key={inq.id} className="hover:bg-[#F8F4ED]/50">
                  <td className="px-4 py-3 text-xs text-[#9A8671] whitespace-nowrap">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{inq.name}</div>
                    <div className="text-xs text-[#6F5A47]">{inq.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">{inq.type}</td>
                  <td className="px-4 py-3 text-xs">{inq.company || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={inq.status}
                      onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                      className="text-xs border border-[#D4C9B8] rounded px-2 py-1 bg-white"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {editingId === inq.id ? (
                      <div className="flex gap-2">
                        <textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="text-xs border border-[#D4C9B8] p-1 flex-1 min-w-[180px]"
                          rows={2}
                        />
                        <button onClick={() => saveNotes(inq.id)} className="text-xs btn-primary px-3 py-1">
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-xs btn-secondary px-2">
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => startEditing(inq)}
                        className="cursor-pointer text-xs min-h-[28px] text-[#6F5A47] hover:text-[#2C2722]"
                      >
                        {inq.notes || <span className="italic text-[#9A8671]">Add notes…</span>}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(inq.id)}
                      className="text-red-600 hover:text-red-700 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-xs text-[#9A8671]">
        Total: {inquiries.length} inquiries • Showing {filtered.length} • Data stored locally in <code>data/inquiries.json</code>
      </div>
    </div>
  );
}
