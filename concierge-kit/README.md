# AI Concierge Kit

Your self-built version of the "AI Concierge" productized service: sell a paid
AI assessment up front, then a monthly retainer of two strategy calls where
you fix and automate the client's business one bottleneck at a time.

## What's in the kit

| Piece | Where | Replaces |
|---|---|---|
| Client intake form ("no form, no call") | `../consulting-site/intake.html` — deploys with the site at `/intake.html`, submissions arrive via Netlify Forms | Jotform |
| Notion Hub template | `notion-hub-template.md` — copy into Notion once per client | Notion template |
| Post-call orchestrator | `skills/ai-concierge-post-call/` | paid skill pack |
| Recap email drafter | `skills/ai-concierge-follow-up-email/` | paid skill pack |
| Notion hub updater | `skills/ai-concierge-call-update/` | paid skill pack |
| Call-one client onboarding | `skills/client-cowork-onboarding/` | onboarding plugin |

**To install the skills:** copy each folder under `skills/` into
`~/.claude/skills/` on the machine where you run Claude. The onboarding skill
goes on the CLIENT'S machine (or run it from yours during the screen-share and
have them do the clicking).

## The engagement run sheet

1. **Land the client.** Free 15-min assessment (walk-in hook) → paid AI
   Assessment → pitch the Concierge retainer on the assessment readout call →
   Stripe invoice for month one.
2. **Send the intake form** (`/intake.html`). No form, no call.
3. **Create their Notion hub** from the template. Share it with them.
4. **Call one:** run `client-cowork-onboarding` on a screen-share (98% of
   clients). If they're already set up: go straight to AOA on their biggest
   bottleneck.
5. **After every call:** run `ai-concierge-post-call` with the transcript.
   Review, hit send. Under five minutes.
6. **Between calls:** Voxer. Promise 12-business-hour responses; deliver in
   minutes.
7. **Renewal:** the hub's growing "tools & skills built" ledger does the
   selling. Real bottlenecks take months to fully automate — say so up front.

## AOA — the on-call framework

For every bottleneck, in order, on a screen-share:
- **Audit** — they show you the manual process exactly as it runs today
- **Optimize** — cut steps that don't need to exist at all
- **Automate** — turn what's left into a Claude skill or a Cowork workflow

One bottleneck at a time, for the life of the engagement.

## Supporting tools

- Payments: Stripe invoices
- Async voice: Voxer (free)
- Notetaker: Fathom (free tier is fine to start)
- Recordings: Google Drive
