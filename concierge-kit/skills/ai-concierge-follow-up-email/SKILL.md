---
name: ai-concierge-follow-up-email
description: Drafts the post-call recap email for an AI Concierge client from a call transcript. Usually invoked by ai-concierge-post-call, but can run standalone when given a transcript and client name. Saves to Gmail drafts when Gmail is connected; otherwise outputs the email ready to paste.
---

# AI Concierge Follow-Up Email

Draft a recap email the client can read in 60 seconds that makes the value of
the call unmistakable.

## Structure

**Subject:** `[Client first name] — today's call: what we built + next steps`

1. **One-line opener.** Warm, specific to the call. No "I hope this email
   finds you well."
2. **What we built today.** Bulleted, concrete, countable. Lead with this —
   it is the reason the email exists. ("Built your quote-drafter skill — a
   quote that took you 45 minutes now takes 5." )
3. **Top takeaways.** Max 3 bullets.
4. **Your action items / my action items.** Two short lists. Client items
   phrased as easy next steps with any links they need.
5. **Next call.** Date if booked, or the scheduling link.
6. **Sign-off** reminding them Voxer is open between calls.

## Rules

- Plain language, short sentences, no AI-speak, no filler.
- Quantify wherever the transcript supports it (time saved, steps removed).
- If Gmail is connected, save as a draft addressed to the client's intake
  email — never send. If not connected, output the finished email in a code
  block for copy-paste.
- Whole email under 250 words.
