// Inbound endpoint for Clay's own "Send to Webhook" action, so a Clay table
// can push enriched account/contact data back into a campaign. Point a Clay
// table's outbound webhook at:
//   https://<your-deploy>/api/webhooks/clay
// and have it send { campaignId, entityType: "account"|"contact", entityId, ...fields }
// where campaignId/entityType/entityId echo what pushToClay() sent out.

import { NextResponse } from "next/server";
import { getCampaign, saveCampaign, getSettings } from "@/lib/store.js";

export async function POST(request) {
  const settings = await getSettings();
  if (settings.clayInboundSecret) {
    const provided = request.headers.get("x-clay-secret");
    if (provided !== settings.clayInboundSecret) {
      return NextResponse.json({ error: "Invalid or missing X-Clay-Secret header." }, { status: 401 });
    }
  }

  const body = await request.json().catch(() => null);
  if (!body?.campaignId || !body?.entityType || !body?.entityId) {
    return NextResponse.json({ error: "Expected { campaignId, entityType, entityId, ...enrichment }." }, { status: 400 });
  }

  const campaign = await getCampaign(body.campaignId);
  if (!campaign) return NextResponse.json({ error: "Unknown campaignId." }, { status: 404 });

  const { campaignId, entityType, entityId, ...enrichment } = body;
  delete enrichment.id; // never let the callback clobber our internal id

  if (entityType === "account") {
    campaign.accounts = campaign.accounts.map((a) => (a.id === entityId ? { ...a, clayEnrichment: { ...(a.clayEnrichment || {}), ...enrichment } } : a));
  } else if (entityType === "contact") {
    campaign.contacts = campaign.contacts.map((c) => (c.id === entityId ? { ...c, clayEnrichment: { ...(c.clayEnrichment || {}), ...enrichment } } : c));
  } else {
    return NextResponse.json({ error: "entityType must be 'account' or 'contact'." }, { status: 400 });
  }

  await saveCampaign(campaign);
  return NextResponse.json({ ok: true });
}
