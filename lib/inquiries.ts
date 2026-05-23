/**
 * KINFORM — Inquiries / Leads Persistence Layer
 *
 * Simple, zero-dependency JSON file storage for form submissions.
 * Perfect for early stage — easy to migrate to Postgres/Turso later.
 *
 * Location: data/inquiries.json (gitignored)
 */

import fs from "fs/promises";
import path from "path";
import { InterestType } from "./designs";

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

export type InquiryStatus = "new" | "contacted" | "qualified" | "closed";

export interface Inquiry {
  id: string;
  createdAt: string; // ISO string
  name: string;
  email: string;
  type: InterestType;
  company?: string;
  message?: string;
  source?: string;
  status: InquiryStatus;
  notes?: string;
  followedUpAt?: string;
}

export interface InquiryFilters {
  status?: InquiryStatus;
  type?: InterestType;
  search?: string;
}

/**
 * Ensure data directory + file exist.
 */
async function ensureDataFile(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(INQUIRIES_FILE);
  } catch {
    await fs.writeFile(INQUIRIES_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

/**
 * Read all inquiries from disk.
 */
export async function getAllInquiries(): Promise<Inquiry[]> {
  await ensureDataFile();
  const raw = await fs.readFile(INQUIRIES_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
}

/**
 * Save inquiries back to disk.
 */
async function saveInquiries(inquiries: Inquiry[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
}

/**
 * Create a new inquiry (from the public form).
 */
export async function createInquiry(data: Omit<Inquiry, "id" | "createdAt" | "status" | "notes">): Promise<Inquiry> {
  const inquiries = await getAllInquiries();

  const newInquiry: Inquiry = {
    id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: "new",
    ...data,
  };

  inquiries.unshift(newInquiry); // newest first
  await saveInquiries(inquiries);

  return newInquiry;
}

/**
 * Update an existing inquiry (status, notes, etc.) — used by internal dashboard.
 */
export async function updateInquiry(id: string, updates: Partial<Inquiry>): Promise<Inquiry | null> {
  const inquiries = await getAllInquiries();
  const index = inquiries.findIndex((i) => i.id === id);

  if (index === -1) return null;

  const updated: Inquiry = {
    ...inquiries[index],
    ...updates,
  };

  // Auto timestamp follow-up
  if (updates.status && updates.status !== "new" && !updated.followedUpAt) {
    updated.followedUpAt = new Date().toISOString();
  }

  inquiries[index] = updated;
  await saveInquiries(inquiries);

  return updated;
}

/**
 * Delete an inquiry (admin only).
 */
export async function deleteInquiry(id: string): Promise<boolean> {
  const inquiries = await getAllInquiries();
  const filtered = inquiries.filter((i) => i.id !== id);

  if (filtered.length === inquiries.length) return false;

  await saveInquiries(filtered);
  return true;
}

/**
 * Get filtered + sorted inquiries (for the dashboard).
 */
export async function getInquiries(filters: InquiryFilters = {}): Promise<Inquiry[]> {
  let inquiries = await getAllInquiries();

  if (filters.status) {
    inquiries = inquiries.filter((i) => i.status === filters.status);
  }
  if (filters.type) {
    inquiries = inquiries.filter((i) => i.type === filters.type);
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    inquiries = inquiries.filter(
      (i) =>
        i.name.toLowerCase().includes(s) ||
        i.email.toLowerCase().includes(s) ||
        (i.company && i.company.toLowerCase().includes(s)) ||
        (i.message && i.message.toLowerCase().includes(s))
    );
  }

  // Already newest first from creation
  return inquiries;
}

/**
 * Export inquiries as CSV string (for download).
 */
export function inquiriesToCSV(inquiries: Inquiry[]): string {
  const headers = ["ID", "Date", "Name", "Email", "Type", "Company", "Status", "Message", "Source", "Notes"];

  const rows = inquiries.map((i) => [
    i.id,
    new Date(i.createdAt).toISOString().slice(0, 10),
    i.name,
    i.email,
    i.type,
    i.company || "",
    i.status,
    (i.message || "").replace(/"/g, '""'),
    i.source || "",
    (i.notes || "").replace(/"/g, '""'),
  ]);

  const escape = (val: string) => `"${val}"`;

  return [
    headers.map(escape).join(","),
    ...rows.map((row) => row.map((cell) => escape(String(cell))).join(",")),
  ].join("\n");
}
