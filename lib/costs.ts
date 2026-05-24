/**
 * KINFORM — Simple Supplier & Material Cost Database
 *
 * Stored in JSON for zero-config MVP.
 * Designed to be easily migrated to a real DB later.
 */

import fs from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const SUPPLIERS_FILE = path.join(DATA_DIR, "suppliers.json");
const MATERIAL_COSTS_FILE = path.join(DATA_DIR, "material-costs.json");

export interface Supplier {
  id: string;
  name: string;
  contactEmail?: string;
  country?: string;
  notes?: string;
  createdAt: string;
}

export interface MaterialCost {
  id: string;
  materialName: string;      // e.g. "Japanese Cotton Poplin"
  supplierId: string;
  costPerUnit: number;       // e.g. 12.50
  unit: string;              // "meter", "piece", "kg"
  currency: string;          // "USD", "EUR"
  minOrderQty?: number;
  leadTimeDays?: number;
  lastUpdated: string;
}

/**
 * Ensure data files exist
 */
async function ensureFiles() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try { await fs.access(SUPPLIERS_FILE); } 
  catch { await fs.writeFile(SUPPLIERS_FILE, "[]", "utf-8"); }

  try { await fs.access(MATERIAL_COSTS_FILE); } 
  catch { await fs.writeFile(MATERIAL_COSTS_FILE, "[]", "utf-8"); }
}

// ================== SUPPLIERS ==================

export async function getSuppliers(): Promise<Supplier[]> {
  await ensureFiles();
  const raw = await fs.readFile(SUPPLIERS_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function createSupplier(data: Omit<Supplier, "id" | "createdAt">): Promise<Supplier> {
  const suppliers = await getSuppliers();
  const newSupplier: Supplier = {
    id: `sup_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data,
  };
  suppliers.push(newSupplier);
  await fs.writeFile(SUPPLIERS_FILE, JSON.stringify(suppliers, null, 2));
  return newSupplier;
}

export async function updateSupplier(id: string, updates: Partial<Supplier>): Promise<Supplier | null> {
  const suppliers = await getSuppliers();
  const index = suppliers.findIndex(s => s.id === id);
  if (index === -1) return null;
  suppliers[index] = { ...suppliers[index], ...updates };
  await fs.writeFile(SUPPLIERS_FILE, JSON.stringify(suppliers, null, 2));
  return suppliers[index];
}

export async function deleteSupplier(id: string): Promise<boolean> {
  const suppliers = await getSuppliers();
  const filtered = suppliers.filter(s => s.id !== id);
  if (filtered.length === suppliers.length) return false;
  await fs.writeFile(SUPPLIERS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

// ================== MATERIAL COSTS ==================

export async function getMaterialCosts(): Promise<MaterialCost[]> {
  await ensureFiles();
  const raw = await fs.readFile(MATERIAL_COSTS_FILE, "utf-8");
  return JSON.parse(raw);
}

export async function createMaterialCost(data: Omit<MaterialCost, "id" | "lastUpdated">): Promise<MaterialCost> {
  const costs = await getMaterialCosts();
  const newCost: MaterialCost = {
    id: `mc_${Date.now()}`,
    lastUpdated: new Date().toISOString(),
    ...data,
  };
  costs.push(newCost);
  await fs.writeFile(MATERIAL_COSTS_FILE, JSON.stringify(costs, null, 2));
  return newCost;
}

export async function updateMaterialCost(id: string, updates: Partial<MaterialCost>): Promise<MaterialCost | null> {
  const costs = await getMaterialCosts();
  const index = costs.findIndex(c => c.id === id);
  if (index === -1) return null;
  costs[index] = { ...costs[index], ...updates, lastUpdated: new Date().toISOString() };
  await fs.writeFile(MATERIAL_COSTS_FILE, JSON.stringify(costs, null, 2));
  return costs[index];
}

export async function deleteMaterialCost(id: string): Promise<boolean> {
  const costs = await getMaterialCosts();
  const filtered = costs.filter(c => c.id !== id);
  if (filtered.length === costs.length) return false;
  await fs.writeFile(MATERIAL_COSTS_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

/**
 * Helper: Get cost for a specific material name (fuzzy match)
 */
export async function getCostForMaterial(materialName: string): Promise<MaterialCost | null> {
  const costs = await getMaterialCosts();
  const match = costs.find(c => 
    c.materialName.toLowerCase().includes(materialName.toLowerCase()) ||
    materialName.toLowerCase().includes(c.materialName.toLowerCase())
  );
  return match || null;
}
