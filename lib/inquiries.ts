/**
 * KINFORM — Inquiries / Leads Persistence Layer
 *
 * Primary storage: Vercel Postgres (waitlist + requests in separate tables).
 * Local fallback: JSON file storage when DB env vars are unavailable.
 */

import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { sql } from "@vercel/postgres";
import { interestTypes, InterestType } from "./designs";

const DATA_DIR = path.join(process.cwd(), "data");
const INQUIRIES_FILE = path.join(DATA_DIR, "inquiries.json");

const DB_ENABLED = Boolean(
  process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL
);

export type InquiryStatus = "new" | "contacted" | "qualified" | "closed";

export interface InquiryTask {
  id: string;
  description: string;
  dueDate?: string;
  completed: boolean;
  createdAt: string;
}

export interface InquiryAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64
}

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
  tasks?: InquiryTask[];
  attachments?: InquiryAttachment[];
  /** Structured pre-order data (populated by enhanced InterestForm) */
  piece?: string; // e.g. "HALTER"
  selectedAccessories?: string[]; // earring slugs
}

export interface InquiryFilters {
  status?: InquiryStatus;
  type?: InterestType;
  search?: string;
}

type InquiryInput = Omit<Inquiry, "id" | "createdAt" | "status" | "notes">;
type DbTable = "waitlist_entries" | "inquiry_requests";

type DbRow = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  type: InterestType;
  company: string | null;
  message: string | null;
  source: string | null;
  status: InquiryStatus;
  notes: string | null;
  followed_up_at: string | null;
  piece: string | null;
  selected_accessories: string[] | null;
  tasks: InquiryTask[] | null;
  attachments: InquiryAttachment[] | null;
};

let dbSchemaEnsured = false;

function normalizeInterestType(type: string): InterestType {
  return interestTypes.includes(type as InterestType) ? (type as InterestType) : "Other";
}

function mapDbRowToInquiry(row: DbRow): Inquiry {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    email: row.email,
    type: normalizeInterestType(row.type),
    company: row.company ?? undefined,
    message: row.message ?? undefined,
    source: row.source ?? undefined,
    status: row.status,
    notes: row.notes ?? undefined,
    followedUpAt: row.followed_up_at ?? undefined,
    piece: row.piece ?? undefined,
    selectedAccessories: row.selected_accessories ?? undefined,
    tasks: row.tasks ?? undefined,
    attachments: row.attachments ?? undefined,
  };
}

async function ensureDbSchema(): Promise<void> {
  if (!DB_ENABLED || dbSchemaEnsured) return;

  await sql`
    CREATE TABLE IF NOT EXISTS waitlist_entries (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT,
      source TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT,
      followed_up_at TIMESTAMPTZ,
      piece TEXT,
      selected_accessories JSONB,
      tasks JSONB,
      attachments JSONB
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS inquiry_requests (
      id TEXT PRIMARY KEY,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      type TEXT NOT NULL,
      company TEXT,
      message TEXT,
      source TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT,
      followed_up_at TIMESTAMPTZ,
      piece TEXT,
      selected_accessories JSONB,
      tasks JSONB,
      attachments JSONB
    )
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_entries_email ON waitlist_entries (email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_waitlist_entries_created_at ON waitlist_entries (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_inquiry_requests_email ON inquiry_requests (email)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_inquiry_requests_type ON inquiry_requests (type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_inquiry_requests_created_at ON inquiry_requests (created_at DESC)`;

  dbSchemaEnsured = true;
}

function tableForType(type: InterestType): DbTable {
  return type === "Early Access List" ? "waitlist_entries" : "inquiry_requests";
}

async function getAllInquiriesFromDb(): Promise<Inquiry[]> {
  await ensureDbSchema();

  const { rows } = await sql<DbRow>`
    SELECT
      id,
      created_at,
      name,
      email,
      'Early Access List'::text AS type,
      NULL::text AS company,
      message,
      source,
      status,
      notes,
      followed_up_at,
      piece,
      selected_accessories,
      tasks,
      attachments
    FROM waitlist_entries
    UNION ALL
    SELECT
      id,
      created_at,
      name,
      email,
      type,
      company,
      message,
      source,
      status,
      notes,
      followed_up_at,
      piece,
      selected_accessories,
      tasks,
      attachments
    FROM inquiry_requests
    ORDER BY created_at DESC
  `;

  return rows.map(mapDbRowToInquiry);
}

async function createInquiryInDb(data: InquiryInput): Promise<Inquiry> {
  await ensureDbSchema();

  const id = `inq_${randomUUID()}`;
  const createdAt = new Date().toISOString();

  if (tableForType(data.type) === "waitlist_entries") {
    const { rows } = await sql<DbRow>`
      INSERT INTO waitlist_entries (
        id,
        created_at,
        updated_at,
        name,
        email,
        message,
        source,
        status,
        piece,
        selected_accessories,
        tasks,
        attachments
      ) VALUES (
        ${id},
        ${createdAt},
        ${createdAt},
        ${data.name},
        ${data.email},
        ${data.message ?? null},
        ${data.source ?? null},
        'new',
        ${data.piece ?? null},
        ${JSON.stringify(data.selectedAccessories ?? null)}::jsonb,
        ${JSON.stringify(data.tasks ?? null)}::jsonb,
        ${JSON.stringify(data.attachments ?? null)}::jsonb
      )
      RETURNING
        id,
        created_at,
        name,
        email,
        'Early Access List'::text AS type,
        NULL::text AS company,
        message,
        source,
        status,
        notes,
        followed_up_at,
        piece,
        selected_accessories,
        tasks,
        attachments
    `;

    return mapDbRowToInquiry(rows[0]);
  }

  const { rows } = await sql<DbRow>`
    INSERT INTO inquiry_requests (
      id,
      created_at,
      updated_at,
      name,
      email,
      type,
      company,
      message,
      source,
      status,
      piece,
      selected_accessories,
      tasks,
      attachments
    ) VALUES (
      ${id},
      ${createdAt},
      ${createdAt},
      ${data.name},
      ${data.email},
      ${data.type},
      ${data.company ?? null},
      ${data.message ?? null},
      ${data.source ?? null},
      'new',
      ${data.piece ?? null},
      ${JSON.stringify(data.selectedAccessories ?? null)}::jsonb,
      ${JSON.stringify(data.tasks ?? null)}::jsonb,
      ${JSON.stringify(data.attachments ?? null)}::jsonb
    )
    RETURNING
      id,
      created_at,
      name,
      email,
      type,
      company,
      message,
      source,
      status,
      notes,
      followed_up_at,
      piece,
      selected_accessories,
      tasks,
      attachments
  `;

  return mapDbRowToInquiry(rows[0]);
}

async function getInquiryTable(id: string): Promise<DbTable | null> {
  await ensureDbSchema();

  const waitlist = await sql<{ id: string }>`SELECT id FROM waitlist_entries WHERE id = ${id} LIMIT 1`;
  if (waitlist.rows.length > 0) return "waitlist_entries";

  const requests = await sql<{ id: string }>`SELECT id FROM inquiry_requests WHERE id = ${id} LIMIT 1`;
  if (requests.rows.length > 0) return "inquiry_requests";

  return null;
}

async function updateInquiryInDb(id: string, updates: Partial<Inquiry>): Promise<Inquiry | null> {
  const table = await getInquiryTable(id);
  if (!table) return null;

  const existingRow =
    table === "waitlist_entries"
      ? await sql<DbRow>`
          SELECT
            id,
            created_at,
            name,
            email,
            'Early Access List'::text AS type,
            NULL::text AS company,
            message,
            source,
            status,
            notes,
            followed_up_at,
            piece,
            selected_accessories,
            tasks,
            attachments
          FROM waitlist_entries
          WHERE id = ${id}
          LIMIT 1
        `
      : await sql<DbRow>`
          SELECT
            id,
            created_at,
            name,
            email,
            type,
            company,
            message,
            source,
            status,
            notes,
            followed_up_at,
            piece,
            selected_accessories,
            tasks,
            attachments
          FROM inquiry_requests
          WHERE id = ${id}
          LIMIT 1
        `;

  const existing = existingRow.rows[0] ? mapDbRowToInquiry(existingRow.rows[0]) : null;
  if (!existing) return null;

  const merged: Inquiry = {
    ...existing,
    ...updates,
  };

  if (updates.status && updates.status !== "new" && !merged.followedUpAt) {
    merged.followedUpAt = new Date().toISOString();
  }

  if (table === "waitlist_entries") {
    const { rows } = await sql<DbRow>`
      UPDATE waitlist_entries
      SET
        updated_at = NOW(),
        name = ${merged.name},
        email = ${merged.email},
        message = ${merged.message ?? null},
        source = ${merged.source ?? null},
        status = ${merged.status},
        notes = ${merged.notes ?? null},
        followed_up_at = ${merged.followedUpAt ?? null},
        piece = ${merged.piece ?? null},
        selected_accessories = ${JSON.stringify(merged.selectedAccessories ?? null)}::jsonb,
        tasks = ${JSON.stringify(merged.tasks ?? null)}::jsonb,
        attachments = ${JSON.stringify(merged.attachments ?? null)}::jsonb
      WHERE id = ${id}
      RETURNING
        id,
        created_at,
        name,
        email,
        'Early Access List'::text AS type,
        NULL::text AS company,
        message,
        source,
        status,
        notes,
        followed_up_at,
        piece,
        selected_accessories,
        tasks,
        attachments
    `;

    return rows[0] ? mapDbRowToInquiry(rows[0]) : null;
  }

  const { rows } = await sql<DbRow>`
    UPDATE inquiry_requests
    SET
      updated_at = NOW(),
      name = ${merged.name},
      email = ${merged.email},
      type = ${merged.type},
      company = ${merged.company ?? null},
      message = ${merged.message ?? null},
      source = ${merged.source ?? null},
      status = ${merged.status},
      notes = ${merged.notes ?? null},
      followed_up_at = ${merged.followedUpAt ?? null},
      piece = ${merged.piece ?? null},
      selected_accessories = ${JSON.stringify(merged.selectedAccessories ?? null)}::jsonb,
      tasks = ${JSON.stringify(merged.tasks ?? null)}::jsonb,
      attachments = ${JSON.stringify(merged.attachments ?? null)}::jsonb
    WHERE id = ${id}
    RETURNING
      id,
      created_at,
      name,
      email,
      type,
      company,
      message,
      source,
      status,
      notes,
      followed_up_at,
      piece,
      selected_accessories,
      tasks,
      attachments
  `;

  return rows[0] ? mapDbRowToInquiry(rows[0]) : null;
}

async function deleteInquiryFromDb(id: string): Promise<boolean> {
  const table = await getInquiryTable(id);
  if (!table) return false;

  if (table === "waitlist_entries") {
    const result = await sql`DELETE FROM waitlist_entries WHERE id = ${id}`;
    return result.rowCount > 0;
  }

  const result = await sql`DELETE FROM inquiry_requests WHERE id = ${id}`;
  return result.rowCount > 0;
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

async function getAllInquiriesFromFile(): Promise<Inquiry[]> {
  await ensureDataFile();
  const raw = await fs.readFile(INQUIRIES_FILE, "utf-8");
  try {
    return JSON.parse(raw) as Inquiry[];
  } catch {
    return [];
  }
}

async function saveInquiries(inquiries: Inquiry[]): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2), "utf-8");
}

/**
 * Read all inquiries from storage.
 */
export async function getAllInquiries(): Promise<Inquiry[]> {
  if (DB_ENABLED) return getAllInquiriesFromDb();
  return getAllInquiriesFromFile();
}

/**
 * Create a new inquiry (from the public form).
 */
export async function createInquiry(data: InquiryInput): Promise<Inquiry> {
  if (DB_ENABLED) return createInquiryInDb(data);

  const inquiries = await getAllInquiriesFromFile();

  const newInquiry: Inquiry = {
    id: `inq_${randomUUID()}`,
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
  if (DB_ENABLED) return updateInquiryInDb(id, updates);

  const inquiries = await getAllInquiriesFromFile();
  const index = inquiries.findIndex((i) => i.id === id);

  if (index === -1) return null;

  const updated: Inquiry = {
    ...inquiries[index],
    ...updates,
  };

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
  if (DB_ENABLED) return deleteInquiryFromDb(id);

  const inquiries = await getAllInquiriesFromFile();
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

// ================== TASKS ==================

export async function addTaskToInquiry(inquiryId: string, description: string, dueDate?: string): Promise<Inquiry | null> {
  const inquiry = (await getAllInquiries()).find((i) => i.id === inquiryId);
  if (!inquiry) return null;

  const newTask: InquiryTask = {
    id: `task_${Date.now()}`,
    description,
    dueDate,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const tasks = [...(inquiry.tasks || []), newTask];
  return updateInquiry(inquiryId, { tasks });
}

export async function toggleTask(inquiryId: string, taskId: string): Promise<Inquiry | null> {
  const inquiry = (await getAllInquiries()).find((i) => i.id === inquiryId);
  if (!inquiry) return null;

  const existingTask = (inquiry.tasks || []).find((task) => task.id === taskId);
  if (!existingTask) return null;

  const tasks = (inquiry.tasks || []).map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );

  return updateInquiry(inquiryId, { tasks });
}

export async function deleteTask(inquiryId: string, taskId: string): Promise<Inquiry | null> {
  const inquiry = (await getAllInquiries()).find((i) => i.id === inquiryId);
  if (!inquiry) return null;

  const tasks = (inquiry.tasks || []).filter((task) => task.id !== taskId);
  return updateInquiry(inquiryId, { tasks });
}

/**
 * Public-facing pre-order statistics for social proof and urgency.
 * Safe to call from Server Components or Server Actions.
 */
export async function getPreOrderStats() {
  const inquiries = await getAllInquiries();

  const preOrders = inquiries.filter((i) => i.type === "Pre-Order / First Run");

  const totalPreOrders = preOrders.length;

  const pieceCounts: Record<string, number> = {};
  const accessoryCounts: Record<string, number> = {};

  preOrders.forEach((inq) => {
    const piece = inq.piece;
    if (piece) {
      pieceCounts[piece] = (pieceCounts[piece] || 0) + 1;
    } else if (inq.message) {
      const match = inq.message.match(/Interested in: ([A-Z]+)/i);
      if (match) {
        const legacyPiece = match[1].toUpperCase();
        pieceCounts[legacyPiece] = (pieceCounts[legacyPiece] || 0) + 1;
      }
    }

    if (inq.selectedAccessories) {
      inq.selectedAccessories.forEach((slug) => {
        accessoryCounts[slug] = (accessoryCounts[slug] || 0) + 1;
      });
    }
  });

  const BATCH_LIMIT = 75;
  const spotsLeft = Math.max(0, BATCH_LIMIT - totalPreOrders);

  return {
    totalPreOrders,
    pieceCounts,
    accessoryCounts,
    spotsLeft,
    batchLimit: BATCH_LIMIT,
  };
}
