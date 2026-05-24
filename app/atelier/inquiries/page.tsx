"use client";

import { useEffect, useState } from "react";
import { Inquiry, InquiryStatus, InquiryTask } from "@/lib/inquiries";
import { interestTypes } from "@/lib/designs";
import { inquiriesToCSV } from "@/lib/csv";
import { ProductionNav } from "@/components/layout/ProductionNav";
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
  const [taskInput, setTaskInput] = useState<Record<string, string>>({}); // inquiryId -> task description
  const [expandedTasks, setExpandedTasks] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<"table" | "kanban">("table");

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

  // Task handlers
  const toggleTaskExpanded = (id: string) => {
    setExpandedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addTask = async (inquiryId: string) => {
    const desc = taskInput[inquiryId]?.trim();
    if (!desc) return;

    const res = await fetch(`/api/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addTask", description: desc }),
    });
    const updated = await res.json();
    if (updated) {
      setInquiries(prev => prev.map(i => i.id === inquiryId ? updated : i));
      setTaskInput(prev => ({ ...prev, [inquiryId]: "" }));
      toast.success("Task added");
    }
  };

  const toggleTaskComplete = async (inquiryId: string, taskId: string) => {
    const res = await fetch(`/api/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggleTask", taskId }),
    });
    const updated = await res.json();
    if (updated) {
      setInquiries(prev => prev.map(i => i.id === inquiryId ? updated : i));
    }
  };

  const deleteTask = async (inquiryId: string, taskId: string) => {
    const res = await fetch(`/api/inquiries/${inquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteTask", taskId }),
    });
    const updated = await res.json();
    if (updated) {
      setInquiries(prev => prev.map(i => i.id === inquiryId ? updated : i));
    }
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
        <div className="flex items-center gap-4">
          <ProductionNav />
          
          {/* View Toggle */}
          <div className="flex rounded-xl border border-[#D4C9B8] p-1 bg-white">
            <button 
              onClick={() => setView("table")}
              className={`px-4 py-1.5 text-sm rounded-lg transition ${view === "table" ? "bg-[#2C2722] text-white" : "hover:bg-[#F8F4ED]"}`}
            >
              Table
            </button>
            <button 
              onClick={() => setView("kanban")}
              className={`px-4 py-1.5 text-sm rounded-lg transition ${view === "kanban" ? "bg-[#2C2722] text-white" : "hover:bg-[#F8F4ED]"}`}
            >
              Kanban
            </button>
          </div>

          <button onClick={exportCSV} className="btn-secondary">
            Export CSV
          </button>
        </div>
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
      ) : view === "kanban" ? (
        /* Kanban View - Modern & Visual for 16-30 audience */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(["new", "contacted", "qualified", "closed"] as InquiryStatus[]).map((status) => {
            const columnInquiries = filtered.filter(i => i.status === status);
            return (
              <div key={status} className="bg-white border border-[#D4C9B8] rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="font-semibold capitalize text-sm tracking-wide">{status}</div>
                  <div className="text-xs px-2 py-0.5 rounded-full bg-[#F1E9DF] text-[#6F5A47]">
                    {columnInquiries.length}
                  </div>
                </div>
                
                <div className="space-y-3 min-h-[200px]">
                  {columnInquiries.length === 0 && (
                    <div className="text-xs text-[#9A8671] italic px-2 py-8 text-center border border-dashed rounded-xl">
                      No inquiries
                    </div>
                  )}
                  
                  {columnInquiries.map((inq) => (
                    <div 
                      key={inq.id}
                      onClick={() => {
                        // Quick status change on click for now
                        const statuses: InquiryStatus[] = ["new", "contacted", "qualified", "closed"];
                        const currentIndex = statuses.indexOf(inq.status);
                        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                        handleStatusChange(inq.id, nextStatus);
                      }}
                      className="bg-[#F8F4ED] border border-[#D4C9B8] rounded-xl p-4 cursor-pointer hover:border-[#B37A5F] active:scale-[0.985] transition-all"
                    >
                      <div className="font-medium text-sm">{inq.name}</div>
                      <div className="text-xs text-[#6F5A47] mt-0.5 truncate">{inq.email}</div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-[10px] text-[#9A8671]">{inq.type}</div>
                        {inq.tasks && inq.tasks.length > 0 && (
                          <div className="text-[10px] bg-white px-1.5 rounded text-[#B37A5F]">
                            {inq.tasks.filter(t => !t.completed).length} open
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#D4C9B8] rounded-xl bg-white -mx-2 px-2 md:mx-0 md:px-0">
          <table className="w-full text-sm min-w-[1000px] md:min-w-full">
            <thead className="bg-[#F1E9DF] text-left">
              <tr>
                <th className="px-3 py-3 font-medium text-left w-20 md:w-auto">Date</th>
                <th className="px-3 py-3 font-medium text-left">Name / Email</th>
                <th className="px-3 py-3 font-medium text-left hidden md:table-cell">Type</th>
                <th className="px-3 py-3 font-medium text-left hidden lg:table-cell">Company</th>
                <th className="px-3 py-3 font-medium text-left">Status</th>
                <th className="px-3 py-3 font-medium text-left">Tasks &amp; Notes</th>
                <th className="px-3 py-3 font-medium text-left w-16 md:w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4C9B8]">
              {filtered.map((inq) => (
                <tr key={inq.id} className="hover:bg-[#F8F4ED]/50">
                  <td className="px-3 py-3 text-xs text-[#9A8671] whitespace-nowrap">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium">{inq.name}</div>
                    <div className="text-xs text-[#6F5A47]">{inq.email}</div>
                  </td>
                  <td className="px-3 py-3 text-xs hidden md:table-cell">{inq.type}</td>
                  <td className="px-3 py-3 text-xs hidden lg:table-cell">{inq.company || "—"}</td>
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

                  {/* Tasks + Notes */}
                  <td className="px-4 py-3 text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <button 
                        onClick={() => toggleTaskExpanded(inq.id)}
                        className="text-[#B37A5F] hover:underline flex items-center gap-1"
                      >
                        {inq.tasks?.length || 0} tasks {expandedTasks[inq.id] ? "▲" : "▼"}
                      </button>
                      <button onClick={() => startEditing(inq)} className="text-[#9A8671] hover:text-[#2C2722]">+ notes</button>
                    </div>

                    {expandedTasks[inq.id] && (
                      <div className="mt-2 space-y-2 border-l-2 border-[#D4C9B8] pl-3">
                        {(inq.tasks || []).map(task => (
                          <div key={task.id} className="flex items-start gap-2 text-[11px]">
                            <input 
                              type="checkbox" 
                              checked={task.completed}
                              onChange={() => toggleTaskComplete(inq.id, task.id)}
                              className="mt-0.5"
                            />
                            <div className={`flex-1 ${task.completed ? "line-through text-[#9A8671]" : ""}`}>
                              {task.description}
                              {task.dueDate && <span className="ml-2 text-[#B37A5F]">due {new Date(task.dueDate).toLocaleDateString()}</span>}
                            </div>
                            <button onClick={() => deleteTask(inq.id, task.id)} className="text-red-500">×</button>
                          </div>
                        ))}

                        <div className="flex gap-2 mt-2">
                          <input
                            type="text"
                            placeholder="New task..."
                            value={taskInput[inq.id] || ""}
                            onChange={(e) => setTaskInput(prev => ({ ...prev, [inq.id]: e.target.value }))}
                            onKeyDown={(e) => { if (e.key === "Enter") addTask(inq.id); }}
                            className="flex-1 border border-[#D4C9B8] px-2 py-1 text-xs rounded"
                          />
                          <button onClick={() => addTask(inq.id)} className="btn-primary text-[10px] px-3">Add</button>
                        </div>
                      </div>
                    )}

                    {editingId === inq.id ? (
                      <div className="mt-2 flex gap-2">
                        <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} className="flex-1 border p-1 text-xs" rows={2} />
                        <button onClick={() => saveNotes(inq.id)} className="btn-primary text-xs px-2">Save</button>
                      </div>
                    ) : inq.notes ? (
                      <div onClick={() => startEditing(inq)} className="mt-1 text-[#6F5A47] cursor-pointer hover:underline">
                        Note: {inq.notes.slice(0, 80)}...
                      </div>
                    ) : null}

                    {/* Attachments */}
                    {inq.attachments && inq.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {inq.attachments.map((att, idx) => (
                          <a
                            key={idx}
                            href={`data:${att.type};base64,${att.data}`}
                            download={att.name}
                            className="block text-[10px] text-[#B37A5F] hover:underline"
                          >
                            📎 {att.name} ({Math.round(att.size / 1024)} KB)
                          </a>
                        ))}
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
