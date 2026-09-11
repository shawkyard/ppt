"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", businessDescription: "", bestCustomersRaw: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create campaign.");
      router.push(`/campaigns/${data.campaign.id}`);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">New Campaign</h1>
      <p className="mb-6 text-sm text-slate-500">
        Give the pipeline what it needs to build an ICP and go find lookalike accounts.
      </p>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        <div>
          <label className="label">Campaign name</label>
          <input
            className="input"
            required
            placeholder="e.g. Q2 outbound — mid-market fintech"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="label">What does your business sell?</label>
          <textarea
            className="input min-h-[90px]"
            required
            placeholder="e.g. We sell a payroll compliance platform for companies expanding into new US states."
            value={form.businessDescription}
            onChange={(e) => setForm({ ...form, businessDescription: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Your best customers</label>
          <textarea
            className="input min-h-[160px] font-mono text-xs"
            required
            placeholder={
              "One per line or paragraph. Include whatever you know:\n" +
              "Acme Corp — 220 employees, fintech, expanded to 4 new states in 2024, was manually tracking compliance in spreadsheets before us.\n" +
              "Northwind Inc — 90 employees, healthtech, hired a Head of People right before signing.\n" +
              "..."
            }
            value={form.bestCustomersRaw}
            onChange={(e) => setForm({ ...form, bestCustomersRaw: e.target.value })}
          />
          <p className="mt-1 text-xs text-slate-400">
            The more specific and varied, the better the ICP the pipeline builds.
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-primary w-full" disabled={saving}>
          {saving ? "Creating…" : "Create campaign"}
        </button>
      </form>
    </div>
  );
}
