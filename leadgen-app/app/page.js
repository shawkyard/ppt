"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STATUS_STYLES = {
  draft: "bg-slate-100 text-slate-600",
  running: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  complete: "bg-emerald-100 text-emerald-700",
  error: "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns || []))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            A campaign runs the full 15-step pipeline — from your best customers to a sales-ready,
            prioritized contact list with outreach reasons and channel picks.
          </p>
        </div>
        <Link href="/campaigns/new" className="btn-primary whitespace-nowrap">
          + New Campaign
        </Link>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {campaigns === null && <p className="text-sm text-slate-500">Loading…</p>}

      {campaigns?.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-slate-600">No campaigns yet.</p>
          <Link href="/campaigns/new" className="btn-primary mt-4 inline-flex">
            Start your first campaign
          </Link>
        </div>
      )}

      {campaigns?.length > 0 && (
        <div className="card divide-y divide-slate-100">
          {campaigns.map((c) => (
            <Link
              key={c.id}
              href={`/campaigns/${c.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50"
            >
              <div>
                <p className="font-medium text-slate-900">{c.name}</p>
                <p className="text-xs text-slate-400">
                  Created {new Date(c.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[c.status] || STATUS_STYLES.draft}`}>
                {(c.status || "draft").replace("_", " ")}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
