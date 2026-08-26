---
name: ai-concierge-call-update
description: Updates a client's Notion AI Concierge Hub after a strategy call — adds the call log entry, refreshes open action items, and logs the tools and skills built. Usually invoked by ai-concierge-post-call; can run standalone given a transcript and the client's hub page.
---

# AI Concierge Call Update

Keep the client's Notion hub current so the page always answers "what am I
paying for?" at a glance.

## Steps

1. Locate the client's hub page (ask which client if ambiguous).
2. Add a new **Call log** entry at the TOP of the call log section:
   - `### Call #N — [date] · [duration]` (increment N from the last entry)
   - Recording link and Fathom summary link (leave a `TODO` placeholder if
     not provided — flag it at the checkpoint)
   - Top 3 takeaways
   - Action items from this call (mine / client's, as checkboxes)
   - **🔧 Tools & skills built on this call** — the detailed, countable list.
     This section gets the most care; it is the retention mechanism.
3. Update the **Open action items** section:
   - Add new items from this call
   - Check off items completed since last call (evidenced in the transcript)
4. Update **Engagement overview → Current focus area** if the focus shifted.
5. If progress on the client's 90-day win is visible in the transcript, note
   it in the call entry — hitting the "90-day" goal by call 2 or 3 is the
   clearest ROI proof there is; never let it pass silently.

## Rules

- Newest call always on top.
- If Notion is not connected, output the complete markdown blocks ready to
  paste, in the hub template's exact format.
- Never delete prior entries; the growing ledger IS the product.
