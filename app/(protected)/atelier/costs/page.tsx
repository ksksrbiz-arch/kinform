"use client";

import { useEffect, useState } from "react";
import { Supplier, MaterialCost } from "@/lib/costs";
import { ProductionNav } from "@/components/layout/ProductionNav";
import { toast } from "sonner";

export default function CostsDatabasePage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [costs, setCosts] = useState<MaterialCost[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newSupplier, setNewSupplier] = useState({ name: "", contactEmail: "", country: "" });
  const [newCost, setNewCost] = useState({ materialName: "", supplierId: "", costPerUnit: 0, unit: "meter", currency: "USD" });

  const loadData = async () => {
    setLoading(true);
    const [sups, mats] = await Promise.all([
      fetch("/api/costs/suppliers").then(r => r.json()),
      fetch("/api/costs/materials").then(r => r.json()),
    ]);
    setSuppliers(sups);
    setCosts(mats);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  // Supplier actions
  const addSupplier = async () => {
    if (!newSupplier.name) return;
    await fetch("/api/costs/suppliers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSupplier),
    });
    setNewSupplier({ name: "", contactEmail: "", country: "" });
    loadData();
    toast.success("Supplier added");
  };

  const deleteSupplier = async (id: string) => {
    await fetch(`/api/costs/suppliers/${id}`, { method: "DELETE" });
    loadData();
    toast.success("Supplier removed");
  };

  // Material Cost actions
  const addMaterialCost = async () => {
    if (!newCost.materialName || !newCost.supplierId) return;
    await fetch("/api/costs/materials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCost),
    });
    setNewCost({ materialName: "", supplierId: "", costPerUnit: 0, unit: "meter", currency: "USD" });
    loadData();
    toast.success("Material cost added");
  };

  const deleteCost = async (id: string) => {
    await fetch(`/api/costs/materials/${id}`, { method: "DELETE" });
    loadData();
    toast.success("Cost entry removed");
  };

  const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || "Unknown";

  return (
    <div className="max-w-7xl mx-auto px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <div className="text-xs tracking-[0.2em] text-[#9A8671]">PRODUCTION • DATABASE</div>
          <h1 className="font-display text-6xl tracking-tight">Supplier &amp; Cost Database</h1>
        </div>
        <ProductionNav />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Suppliers */}
        <div className="bg-white border border-[#D4C9B8] rounded-2xl p-8">
          <h2 className="font-medium text-xl mb-4">Suppliers</h2>

          <div className="space-y-3 mb-6">
            <input placeholder="Supplier Name" value={newSupplier.name} onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })} className="w-full border p-2 rounded" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Email" value={newSupplier.contactEmail} onChange={e => setNewSupplier({ ...newSupplier, contactEmail: e.target.value })} className="border p-2 rounded" />
              <input placeholder="Country" value={newSupplier.country} onChange={e => setNewSupplier({ ...newSupplier, country: e.target.value })} className="border p-2 rounded" />
            </div>
            <button onClick={addSupplier} className="btn-primary w-full">Add Supplier</button>
          </div>

          <div className="space-y-2 text-sm">
            {suppliers.length === 0 && <p className="text-[#9A8671]">No suppliers yet.</p>}
            {suppliers.map(s => (
              <div key={s.id} className="flex justify-between border p-3 rounded">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs text-[#6F5A47]">{s.country} • {s.contactEmail}</div>
                </div>
                <button onClick={() => deleteSupplier(s.id)} className="text-red-600 text-xs">Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* Material Costs */}
        <div className="bg-white border border-[#D4C9B8] rounded-2xl p-8">
          <h2 className="font-medium text-xl mb-4">Material Costs</h2>

          <div className="space-y-3 mb-6">
            <input placeholder="Material Name (e.g. Japanese Cotton Poplin)" value={newCost.materialName} onChange={e => setNewCost({ ...newCost, materialName: e.target.value })} className="w-full border p-2 rounded" />
            <div className="grid grid-cols-2 gap-3">
              <select value={newCost.supplierId} onChange={e => setNewCost({ ...newCost, supplierId: e.target.value })} className="border p-2 rounded">
                <option value="">Select Supplier</option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input type="number" placeholder="Cost per unit" value={newCost.costPerUnit} onChange={e => setNewCost({ ...newCost, costPerUnit: parseFloat(e.target.value) })} className="border p-2 rounded" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Unit (meter, piece...)" value={newCost.unit} onChange={e => setNewCost({ ...newCost, unit: e.target.value })} className="border p-2 rounded" />
              <select value={newCost.currency} onChange={e => setNewCost({ ...newCost, currency: e.target.value })} className="border p-2 rounded">
                <option>USD</option><option>EUR</option><option>GBP</option>
              </select>
            </div>
            <button onClick={addMaterialCost} className="btn-primary w-full">Add Material Cost</button>
          </div>

          <div className="space-y-2 text-sm">
            {costs.length === 0 && <p className="text-[#9A8671]">No material costs recorded yet.</p>}
            {costs.map(c => (
              <div key={c.id} className="flex justify-between border p-3 rounded text-xs">
                <div>
                  <span className="font-medium">{c.materialName}</span> — {getSupplierName(c.supplierId)}<br />
                  <span className="text-[#B37A5F] font-medium">{c.currency} {c.costPerUnit} / {c.unit}</span>
                </div>
                <button onClick={() => deleteCost(c.id)} className="text-red-600">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-[#9A8671] mt-8 text-center">
        This database is used to power more accurate costing in the BOM and future tools.
      </p>
    </div>
  );
}
