// Clay integration.
//
// Clay doesn't expose a general-purpose "search" API the way Apollo does —
// its model is the reverse: you push rows into a Clay table (via a
// webhook), Clay runs its enrichment waterfall/AI columns on them, and it
// can call back out to a webhook of yours when a row is ready. So this
// integration is two halves:
//   1. pushToClay()      — outbound: send candidate accounts/contacts to a
//      Clay table's "Send to Webhook" trigger URL, tagged with our own
//      campaign/entity id.
//   2. /api/webhooks/clay — inbound: a Clay table's own "Send to Webhook"
//      enrichment action posts the enriched row back here, and we merge it
//      onto the matching account/contact by the id we sent.
//
// Both are optional — every pipeline stage that touches Clay works fine
// (just without the extra enrichment) if no webhook URL is configured.

import { getSettings } from "./store.js";

export async function isClayConfigured() {
  const settings = await getSettings();
  return Boolean(settings.clayWebhookUrl);
}

/**
 * Push a batch of records to the configured Clay webhook. Each record
 * should include `campaignId` and `entityId` (account or contact id) so the
 * inbound callback can be matched back up.
 */
export async function pushToClay(records) {
  const settings = await getSettings();
  if (!settings.clayWebhookUrl || !records?.length) return { pushed: 0 };

  const results = await Promise.allSettled(
    records.map((record) =>
      fetch(settings.clayWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      })
    )
  );

  const pushed = results.filter((r) => r.status === "fulfilled" && r.value.ok).length;
  return { pushed, attempted: records.length };
}
