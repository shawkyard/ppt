---
name: ai-concierge-post-call
description: Orchestrator for post-call admin after an AI Concierge client strategy call. Use immediately after a client call when given a transcript (Fathom or otherwise). Runs the follow-up email draft and the Notion hub update, then stops at a human review checkpoint. Trigger on "post-call", "just finished a call with [client]", or a pasted/attached call transcript.
---

# AI Concierge Post-Call

You are running the post-call workflow for an AI Concierge engagement. The
goal: all admin done in under five minutes, with one human checkpoint at the
end.

## Inputs to collect (ask only for what's missing)

1. Client name / which engagement
2. The call transcript (pasted text, Fathom summary link content, or file)
3. Call date and duration (default: today; pull duration from transcript if present)
4. Recording link (Google Drive) and Fathom summary link, if available

## Steps

1. Read the full transcript once. Extract:
   - Top 3 takeaways (decisions and insights, not pleasantries)
   - Action items — split into MINE (the consultant's) and CLIENT'S
   - **Everything built or configured on the call**: skills created, context
     files written, tools connected, automations set up, settings changed.
     Be specific and countable ("built 2 skills, created 3 context files"),
     because this list is the client-facing proof of value.
   - Anything promised for next call
2. Run the two sub-skills with this extracted material:
   - `ai-concierge-follow-up-email` — drafts the recap email
   - `ai-concierge-call-update` — updates the client's Notion hub
3. Present both outputs together for review: the email draft and the exact
   Notion updates made (or the block to paste, if Notion isn't connected).
4. STOP. Do not send the email yourself — the human reviews and hits send.

## Rules

- Speed matters: the recap must reach the client the same day, ideally within
  the hour, so they feel the investment paying off before the day is over.
- Never invent takeaways or built items not evidenced in the transcript.
- If the transcript shows an unresolved client question, surface it at the
  checkpoint so it can be answered in the recap email.
