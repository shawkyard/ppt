"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";

// Client-side mirror of lib/skills.js's STAGES metadata. Kept separate (not
// imported) so the Anthropic SDK never gets pulled into the browser bundle.
const STAGES = [
  { key: "bestCustomerAnalyser", title: "Best-Customer Analyser" },
  { key: "icpCriteriaBuilder", title: "ICP Criteria Builder" },
  { key: "exclusionRuleBuilder", title: "Exclusion Rule Builder" },
  { key: "lookalikeAccountResearcher", title: "Lookalike Account Researcher" },
  { key: "marketSegmentMapper", title: "Market Segment Mapper" },
  { key: "accountFitScorer", title: "Account Fit Scorer" },
  { key: "buyingSignalFinder", title: "Buying Signal Finder" },
  { key: "signalRelevanceChecker", title: "Signal Relevance Checker" },
  { key: "buyerRoleMapper", title: "Buyer Role Mapper" },
  { key: "contactResearchBrief", title: "Contact Research Brief" },
  { key: "accountPriorityRanker", title: "Account Priority Ranker" },
  { key: "outreachReasonBuilder", title: "Outreach Reason Builder" },
  { key: "channelSelector", title: "Channel Selector" },
  { key: "leadHandoffWriter", title: "Lead Handoff Writer" },
  { key: "listQualityAuditor", title: "List Quality Auditor" },
];

const DOT = {
  done: "bg-emerald-500",
  running: "bg-amber-500 animate-pulse",
  error: "bg-red-500",
  pending: "bg-slate-300",
};

export default function CampaignPage() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [selected, setSelected] = useState(STAGES[0].key);
  const [view, setView] = useState("pipeline"); // pipeline | accounts | contacts
  const [busy, setBusy] = useState(false);
  const [runningAll, setRunningAll] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/campaigns/${id}`);
    const data = await res.json();
    if (res.ok) setCampaign(data.campaign);
    return data.campaign;
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  function statusOf(key) {
    return campaign?.stages?.[key]?.status || "pending";
  }

  const nextStage = STAGES.find((s) => statusOf(s.key) !== "done")?.key || null;

  async function runStage(stageKey) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: stageKey }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Stage failed.");
      setCampaign(data.campaign);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function runAll() {
    setRunningAll(true);
    let current = campaign;
    for (const stage of STAGES) {
      if (current?.stages?.[stage.key]?.status === "done") continue;
      setSelected(stage.key);
      const ok = await runStage(stage.key);
      if (!ok) break;
      current = await load();
    }
    setRunningAll(false);
  }

  if (!campaign) return <p className="text-sm text-slate-500">Loading…</p>;

  const stageResult = campaign.stages?.[selected];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">{campaign.name}</h1>
        <p className="mt-1 max-w-3xl text-sm text-slate-500">{campaign.businessDescription}</p>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button className="btn-primary" disabled={busy || runningAll || !nextStage} onClick={() => nextStage && runStage(nextStage)}>
          {busy && !runningAll ? "Running…" : nextStage ? `Run next: ${STAGES.find((s) => s.key === nextStage)?.title}` : "Pipeline complete"}
        </button>
        <button className="btn-secondary" disabled={busy || runningAll || !nextStage} onClick={runAll}>
          {runningAll ? "Running all…" : "Run all remaining"}
        </button>
        <a className="btn-secondary" href={`/api/campaigns/${id}/export`}>
          Export CSV
        </a>
        <div className="ml-auto flex gap-1 rounded-lg bg-slate-100 p-1 text-sm">
          {["pipeline", "accounts", "contacts"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 capitalize ${view === v ? "bg-white shadow-sm" : "text-slate-500"}`}
            >
              {v} {v === "accounts" ? `(${campaign.accounts.length})` : v === "contacts" ? `(${campaign.contacts.length})` : ""}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      {view === "pipeline" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[280px_1fr]">
          <ol className="card divide-y divide-slate-100">
            {STAGES.map((s, i) => (
              <li key={s.key}>
                <button
                  onClick={() => setSelected(s.key)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-slate-50 ${selected === s.key ? "bg-orange-50" : ""}`}
                >
                  <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[statusOf(s.key)]}`} />
                  <span className="text-slate-400">{i + 1}.</span>
                  <span className={selected === s.key ? "font-medium text-slate-900" : "text-slate-600"}>{s.title}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="card p-5">
            <h2 className="mb-3 font-semibold text-slate-900">{STAGES.find((s) => s.key === selected)?.title}</h2>
            {!stageResult && <p className="text-sm text-slate-400">Not run yet.</p>}
            {stageResult?.status === "error" && <p className="text-sm text-red-600">{stageResult.error}</p>}
            {stageResult?.output && <StageOutput stageKey={selected} output={stageResult.output} />}
          </div>
        </div>
      )}

      {view === "accounts" && <AccountsTable accounts={campaign.accounts} />}
      {view === "contacts" && <ContactsTable contacts={campaign.contacts} accounts={campaign.accounts} />}
    </div>
  );
}

function StageOutput({ stageKey, output }) {
  if (stageKey === "bestCustomerAnalyser") {
    return (
      <div className="space-y-3 text-sm">
        <p className="text-slate-700">{output.summary}</p>
        {output.patterns.map((p, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-3">
            <p className="font-medium text-slate-800">{p.trait}</p>
            <p className="text-slate-500">{p.evidence}</p>
          </div>
        ))}
      </div>
    );
  }
  if (stageKey === "icpCriteriaBuilder") {
    return (
      <div className="space-y-3 text-sm">
        <div>
          <p className="label">Must-haves</p>
          <ul className="list-disc pl-5 text-slate-700">
            {output.mustHaves.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs uppercase text-slate-400">
              <th className="py-1">Field</th>
              <th>Value</th>
              <th>Weight</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            {output.criteria.map((c, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="py-2 pr-2 font-medium">{c.field}</td>
                <td className="pr-2 text-slate-600">{c.value}</td>
                <td className="pr-2">{"★".repeat(c.weight)}</td>
                <td className="text-slate-500">{c.rationale}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (stageKey === "exclusionRuleBuilder") {
    return (
      <ul className="space-y-2 text-sm">
        {output.rules.map((r, i) => (
          <li key={i} className="rounded-lg bg-red-50 p-3">
            <p className="font-medium text-red-800">{r.rule}</p>
            <p className="text-red-600">{r.reason}</p>
          </li>
        ))}
      </ul>
    );
  }
  if (stageKey === "lookalikeAccountResearcher") {
    return (
      <p className="text-sm text-slate-600">
        Found {output.count} candidate account(s) via Apollo using derived filters:{" "}
        <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">{JSON.stringify(output.filters)}</code>. See the Accounts tab.
      </p>
    );
  }
  if (stageKey === "marketSegmentMapper") {
    return (
      <div className="space-y-2 text-sm">
        {output.segments.map((s, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-3">
            <p className="font-medium text-slate-800">
              {s.name} <span className="text-slate-400">({s.accountIds.length})</span>
            </p>
            <p className="text-slate-500">{s.description}</p>
          </div>
        ))}
      </div>
    );
  }
  if (stageKey === "accountFitScorer") {
    return <p className="text-sm text-slate-600">Scored {output.scores.length} account(s). See the Accounts tab for scores and reasons.</p>;
  }
  if (stageKey === "buyingSignalFinder") {
    return (
      <p className="text-sm text-slate-600">
        Found {output.signalCount} signal(s) across candidate accounts.{" "}
        {output.clayConfigured ? `Pushed ${output.clayPush.pushed}/${output.clayPush.attempted} accounts to Clay.` : "Clay isn't configured — skipped."}
      </p>
    );
  }
  if (stageKey === "signalRelevanceChecker") {
    return <p className="text-sm text-slate-600">Assessed {output.assessments.length} signal(s) for relevance. See the Accounts tab.</p>;
  }
  if (stageKey === "buyerRoleMapper") {
    return (
      <div className="space-y-2 text-sm">
        <p className="text-slate-700">
          Target titles: {output.targetTitles.join(", ")} · Seniorities: {output.seniorities.join(", ")}
        </p>
        {output.roles.map((r, i) => (
          <div key={i} className="rounded-lg bg-slate-50 p-3">
            <p className="font-medium capitalize text-slate-800">{r.roleType.replace("_", " ")}</p>
            <p className="text-slate-500">{r.titles.join(", ")} — {r.why}</p>
          </div>
        ))}
      </div>
    );
  }
  if (stageKey === "contactResearchBrief") {
    return <p className="text-sm text-slate-600">Researched {output.contactCount} contact(s). See the Contacts tab.</p>;
  }
  if (stageKey === "accountPriorityRanker") {
    return <p className="text-sm text-slate-600">Ranked {output.ranking.length} account(s). See the Accounts tab.</p>;
  }
  if (stageKey === "outreachReasonBuilder" || stageKey === "channelSelector" || stageKey === "leadHandoffWriter") {
    return <p className="text-sm text-slate-600">Done for {output.count} contact(s). See the Contacts tab.</p>;
  }
  if (stageKey === "listQualityAuditor") {
    return (
      <div className="space-y-3 text-sm">
        <p className="text-slate-700">{output.overallAssessment}</p>
        <p className="font-medium text-emerald-700">{output.readyForHandoffCount} contact(s) ready for handoff.</p>
        {output.issues.map((issue, i) => (
          <div
            key={i}
            className={`rounded-lg p-3 ${issue.severity === "high" ? "bg-red-50 text-red-700" : issue.severity === "medium" ? "bg-amber-50 text-amber-700" : "bg-slate-50 text-slate-600"}`}
          >
            <span className="font-medium uppercase">{issue.severity}</span> · {issue.entityType} · {issue.issue}
          </div>
        ))}
      </div>
    );
  }
  return <pre className="whitespace-pre-wrap text-xs text-slate-500">{JSON.stringify(output, null, 2)}</pre>;
}

function AccountsTable({ accounts }) {
  const sorted = [...accounts].sort((a, b) => (a.priorityRank || 999) - (b.priorityRank || 999));
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-2">Rank</th>
            <th className="px-4 py-2">Account</th>
            <th className="px-4 py-2">Segment</th>
            <th className="px-4 py-2">Fit</th>
            <th className="px-4 py-2">Signals</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((a) => (
            <tr key={a.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{a.priorityRank || "—"}</td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-800">{a.name}</p>
                <p className="text-xs text-slate-400">{a.domain} · {a.employees} employees · {a.location}</p>
              </td>
              <td className="px-4 py-3 text-slate-600">{a.segment || "—"}</td>
              <td className="px-4 py-3">
                {a.fitScore != null ? <span className="font-semibold text-slate-800">{a.fitScore}</span> : "—"}
              </td>
              <td className="px-4 py-3 text-slate-600">{(a.signals || []).filter((s) => s.relevant).length} relevant</td>
              <td className="px-4 py-3">
                {a.excluded ? <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Excluded</span> : <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Active</span>}
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                No accounts yet — run the pipeline through "Lookalike Account Researcher".
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ContactsTable({ contacts, accounts }) {
  const accountsById = Object.fromEntries(accounts.map((a) => [a.id, a]));
  return (
    <div className="space-y-3">
      {contacts.map((c) => (
        <div key={c.id} className="card p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-medium text-slate-900">
                {c.name} <span className="font-normal text-slate-400">— {c.title}</span>
              </p>
              <p className="text-xs text-slate-400">
                {accountsById[c.accountId]?.name} · {c.email || "no email found"} {c.channel && `· recommended channel: ${c.channel}`}
              </p>
            </div>
            {c.channel && <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">{c.channel}</span>}
          </div>
          {c.brief && <p className="mt-2 text-sm text-slate-600">{c.brief}</p>}
          {c.outreachReason && (
            <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              <span className="font-medium">Why reach out: </span>
              {c.outreachReason}
            </p>
          )}
          {c.handoff && (
            <div className="mt-3 rounded-lg border border-orange-200 bg-orange-50 p-3 text-sm">
              <p className="font-medium text-orange-900">Suggested opener</p>
              <p className="text-orange-800">{c.handoff.suggestedOpener}</p>
              <p className="mt-2 font-medium text-orange-900">Talking points</p>
              <ul className="list-disc pl-5 text-orange-800">
                {c.handoff.talkingPoints.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
              <p className="mt-2 text-orange-700">
                <span className="font-medium">Next step: </span>
                {c.handoff.recommendedNextStep}
              </p>
            </div>
          )}
        </div>
      ))}
      {contacts.length === 0 && (
        <div className="card p-8 text-center text-slate-400">No contacts yet — run the pipeline through "Contact Research Brief".</div>
      )}
    </div>
  );
}
