import { Inquiry } from "./inquiries";

/**
 * Pure utility — safe to import from client components.
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
