import { NextResponse } from "next/server";
import { getCampaign } from "@/lib/store.js";

function csvEscape(value) {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(request, { params }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const accountsById = Object.fromEntries(campaign.accounts.map((a) => [a.id, a]));
  const headers = [
    "Account",
    "Domain",
    "Segment",
    "Fit Score",
    "Priority Rank",
    "Contact Name",
    "Title",
    "Email",
    "LinkedIn",
    "Channel",
    "Outreach Reason",
    "Suggested Opener",
    "Recommended Next Step",
  ];

  const rows = campaign.contacts
    .filter((c) => c.handoff)
    .sort((a, b) => (accountsById[a.accountId]?.priorityRank || 999) - (accountsById[b.accountId]?.priorityRank || 999))
    .map((c) => {
      const a = accountsById[c.accountId] || {};
      return [
        a.name,
        a.domain,
        a.segment,
        a.fitScore,
        a.priorityRank,
        c.name,
        c.title,
        c.email,
        c.linkedinUrl,
        c.channel,
        c.outreachReason,
        c.handoff?.suggestedOpener,
        c.handoff?.recommendedNextStep,
      ];
    });

  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${campaign.name.replace(/[^a-z0-9]+/gi, "-")}-handoff.csv"`,
    },
  });
}
