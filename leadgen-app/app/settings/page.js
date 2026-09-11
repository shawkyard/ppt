"use client";

import { useEffect, useState } from "react";

const FIELDS = [
  { key: "anthropicApiKey", label: "Anthropic API key", secret: true, help: "Powers every reasoning stage. Get one at console.anthropic.com." },
  { key: "anthropicModel", label: "Claude model", secret: false, help: "e.g. claude-sonnet-5" },
  { key: "apolloApiKey", label: "Apollo.io API key", secret: true, help: "Powers account research, signals, and contact search. Get one at app.apollo.io." },
  { key: "clayWebhookUrl", label: "Clay webhook URL (optional)", secret: false, help: "A Clay table's 'Send to Webhook' inbound URL, for extra enrichment." },
  { key: "clayInboundSecret", label: "Clay inbound secret (optional)", secret: true, help: "If set, required as X-Clay-Secret on inbound callbacks to /api/webhooks/clay." },
  { key: "maxAccounts", label: "Max accounts per campaign", secret: false, type: "number", help: "Caps Apollo usage and Claude token spend per run." },
  { key: "maxContactsPerAccount", label: "Max contacts per account", secret: false, type: "number" },
];

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then(setForm);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setForm(data);
    setSaving(false);
    setSaved(true);
  }

  if (!form) return <p className="text-sm text-slate-500">Loading…</p>;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Settings</h1>
      <p className="mb-6 text-sm text-slate-500">
        Stored locally on this deployment. Each self-hosted instance uses its own keys — nothing is shared
        between installs.
      </p>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="label">{f.label}</label>
            <input
              className="input"
              type={f.type === "number" ? "number" : f.secret ? "password" : "text"}
              placeholder={f.secret && form[`${f.key}Set`] ? "•••• saved — leave blank to keep" : ""}
              value={form[f.key] ?? ""}
              onChange={(e) => setForm({ ...form, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
            />
            {f.help && <p className="mt-1 text-xs text-slate-400">{f.help}</p>}
          </div>
        ))}

        <button type="submit" className="btn-primary w-full" disabled={saving}>
          {saving ? "Saving…" : "Save settings"}
        </button>
        {saved && <p className="text-center text-sm text-emerald-600">Saved.</p>}
      </form>
    </div>
  );
}
