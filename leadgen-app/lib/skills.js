// The 15 skills. Each is a small, single-purpose reasoning function: given
// structured input, return structured output via lib/anthropic.js's forced
// tool-call JSON mode. lib/pipeline.js wires them together and handles the
// Apollo/Clay data-fetching stages sit between them.

import { runSkill } from "./anthropic.js";

export const STAGES = [
  { key: "bestCustomerAnalyser", title: "Best-Customer Analyser", description: "Analyses your best customers to find the patterns that matter.", kind: "claude" },
  { key: "icpCriteriaBuilder", title: "ICP Criteria Builder", description: "Builds a clear Ideal Customer Profile with weighted criteria.", kind: "claude" },
  { key: "exclusionRuleBuilder", title: "Exclusion Rule Builder", description: "Sets firm rules to remove companies that will never be a fit.", kind: "claude" },
  { key: "lookalikeAccountResearcher", title: "Lookalike Account Researcher", description: "Finds accounts that look like your best existing customers.", kind: "apollo" },
  { key: "marketSegmentMapper", title: "Market Segment Mapper", description: "Maps the candidate accounts into segments worth targeting.", kind: "claude" },
  { key: "accountFitScorer", title: "Account Fit Scorer", description: "Scores how well each account fits your ICP.", kind: "claude" },
  { key: "buyingSignalFinder", title: "Buying Signal Finder", description: "Finds real buying signals — hiring, growth, and optional Clay enrichment.", kind: "apollo" },
  { key: "signalRelevanceChecker", title: "Signal Relevance Checker", description: "Checks whether each signal is relevant and truly indicates intent.", kind: "claude" },
  { key: "buyerRoleMapper", title: "Buyer Role Mapper", description: "Identifies the right buyer, influencer and decision-maker titles.", kind: "claude" },
  { key: "contactResearchBrief", title: "Contact Research Brief", description: "Finds real contacts at each account and briefs you on each one.", kind: "apollo" },
  { key: "accountPriorityRanker", title: "Account Priority Ranker", description: "Ranks accounts by fit, signals and timing.", kind: "claude" },
  { key: "outreachReasonBuilder", title: "Outreach Reason Builder", description: "Writes the specific reason to reach out to each contact.", kind: "claude" },
  { key: "channelSelector", title: "Channel Selector", description: "Recommends the best channel to start each conversation.", kind: "claude" },
  { key: "leadHandoffWriter", title: "Lead Handoff Writer", description: "Prepares a clean handoff packet with context for sales.", kind: "claude" },
  { key: "listQualityAuditor", title: "List Quality Auditor", description: "Audits the final list for weak fit, stale signals and missing data.", kind: "claude" },
];

// ---------- 1. Best-Customer Analyser ----------
export async function analyseBestCustomers({ businessDescription, bestCustomersRaw }) {
  return runSkill({
    system:
      "You are a B2B revenue operations analyst. You study a company's best existing customers " +
      "and extract the concrete, checkable patterns that predict a great customer — not vague platitudes.",
    prompt:
      `Business:\n${businessDescription}\n\n` +
      `Best customers (freeform notes, one company per line or paragraph):\n${bestCustomersRaw}\n\n` +
      "Identify the patterns across these customers: firmographic (industry, size, geography), " +
      "situational (what was happening when they bought), and behavioral (how they use the product). " +
      "Cite the evidence from the input for each pattern.",
    schema: {
      type: "object",
      properties: {
        summary: { type: "string", description: "2-3 sentence summary of what makes a great customer." },
        patterns: {
          type: "array",
          items: {
            type: "object",
            properties: {
              trait: { type: "string" },
              evidence: { type: "string" },
            },
            required: ["trait", "evidence"],
          },
        },
      },
      required: ["summary", "patterns"],
    },
    maxTokens: 1500,
  });
}

// ---------- 2. ICP Criteria Builder ----------
export async function buildIcpCriteria({ businessDescription, patterns }) {
  return runSkill({
    system:
      "You are a B2B GTM strategist. Turn observed customer patterns into a weighted Ideal Customer " +
      "Profile that a sales team could use to screen accounts in under a minute.",
    prompt:
      `Business:\n${businessDescription}\n\n` +
      `Observed patterns:\n${JSON.stringify(patterns, null, 2)}\n\n` +
      "Produce ICP criteria. Each criterion needs a weight 1-5 (5 = strongest signal of fit). " +
      "Also list 2-4 non-negotiable must-haves.",
    schema: {
      type: "object",
      properties: {
        mustHaves: { type: "array", items: { type: "string" } },
        criteria: {
          type: "array",
          items: {
            type: "object",
            properties: {
              field: { type: "string", description: "e.g. Industry, Company size, Geography, Tech stack, Trigger event" },
              value: { type: "string" },
              weight: { type: "integer", minimum: 1, maximum: 5 },
              rationale: { type: "string" },
            },
            required: ["field", "value", "weight", "rationale"],
          },
        },
      },
      required: ["mustHaves", "criteria"],
    },
    maxTokens: 1800,
  });
}

// ---------- 3. Exclusion Rule Builder ----------
export async function buildExclusionRules({ businessDescription, criteria, mustHaves }) {
  return runSkill({
    system:
      "You are a B2B GTM strategist. Write hard exclusion rules that keep a sales team from wasting " +
      "time on accounts that will never close, even if they superficially match the ICP.",
    prompt:
      `Business:\n${businessDescription}\n\n` +
      `ICP criteria:\n${JSON.stringify(criteria, null, 2)}\n\n` +
      `Must-haves:\n${JSON.stringify(mustHaves, null, 2)}\n\n` +
      "List firm exclusion rules (e.g. too small/large, wrong geography, regulated industries you can't " +
      "serve, existing customers, direct competitors, known bad-fit segments).",
    schema: {
      type: "object",
      properties: {
        rules: {
          type: "array",
          items: {
            type: "object",
            properties: {
              rule: { type: "string" },
              reason: { type: "string" },
            },
            required: ["rule", "reason"],
          },
        },
      },
      required: ["rules"],
    },
    maxTokens: 1200,
  });
}

// ---------- internal: translate ICP criteria into Apollo search filters ----------
export async function deriveApolloFilters({ criteria, mustHaves }) {
  return runSkill({
    system:
      "You translate an Ideal Customer Profile into Apollo.io organization-search filters. " +
      "Employee ranges must use Apollo's bucket format like \"1,10\", \"11,50\", \"51,200\", \"201,500\", " +
      "\"501,1000\", \"1001,5000\", \"5001,10000\", \"10001+\".",
    prompt:
      `ICP criteria:\n${JSON.stringify(criteria, null, 2)}\n\nMust-haves:\n${JSON.stringify(mustHaves, null, 2)}`,
    schema: {
      type: "object",
      properties: {
        keywords: { type: "array", items: { type: "string" }, description: "Industry/keyword tags to search for." },
        locations: { type: "array", items: { type: "string" }, description: "Geographies, e.g. 'United States', 'California, US'." },
        employeeRanges: { type: "array", items: { type: "string" }, description: "Apollo bucket strings." },
      },
      required: ["keywords", "locations", "employeeRanges"],
    },
    maxTokens: 500,
  });
}

// ---------- 5. Market Segment Mapper ----------
export async function mapMarketSegments({ accounts }) {
  return runSkill({
    system: "You are a market analyst. Group a list of candidate accounts into a small number of meaningful segments.",
    prompt:
      "Accounts:\n" +
      JSON.stringify(
        accounts.map((a) => ({ id: a.id, name: a.name, industry: a.industry, employees: a.employees, location: a.location })),
        null,
        2
      ) +
      "\n\nGroup these into 2-6 segments (e.g. by industry vertical, size band, or geography — whichever " +
      "split is most useful for prioritizing outreach). Every account id must appear in exactly one segment.",
    schema: {
      type: "object",
      properties: {
        segments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              description: { type: "string" },
              accountIds: { type: "array", items: { type: "string" } },
            },
            required: ["name", "description", "accountIds"],
          },
        },
      },
      required: ["segments"],
    },
    maxTokens: 1800,
  });
}

// ---------- 6. Account Fit Scorer ----------
export async function scoreAccountFit({ accounts, criteria, exclusionRules }) {
  return runSkill({
    system:
      "You are a B2B account scoring engine. Score each account's fit against the ICP criteria (0-100) " +
      "and flag any account that trips an exclusion rule.",
    prompt:
      `ICP criteria:\n${JSON.stringify(criteria, null, 2)}\n\n` +
      `Exclusion rules:\n${JSON.stringify(exclusionRules, null, 2)}\n\n` +
      "Accounts:\n" +
      JSON.stringify(
        accounts.map((a) => ({ id: a.id, name: a.name, domain: a.domain, industry: a.industry, employees: a.employees, location: a.location })),
        null,
        2
      ),
    schema: {
      type: "object",
      properties: {
        scores: {
          type: "array",
          items: {
            type: "object",
            properties: {
              accountId: { type: "string" },
              score: { type: "integer", minimum: 0, maximum: 100 },
              reasons: { type: "array", items: { type: "string" } },
              excluded: { type: "boolean" },
              exclusionReason: { type: "string" },
            },
            required: ["accountId", "score", "reasons", "excluded"],
          },
        },
      },
      required: ["scores"],
    },
    maxTokens: 3000,
  });
}

// ---------- 8. Signal Relevance Checker ----------
export async function checkSignalRelevance({ businessDescription, signals }) {
  if (!signals.length) return { assessments: [] };
  return runSkill({
    system:
      "You are a demand-generation analyst. Not every hiring post or company event means buying intent. " +
      "Decide which signals genuinely suggest this business's product is newly relevant to the account right now.",
    prompt:
      `Business:\n${businessDescription}\n\nSignals:\n${JSON.stringify(signals, null, 2)}`,
    schema: {
      type: "object",
      properties: {
        assessments: {
          type: "array",
          items: {
            type: "object",
            properties: {
              signalId: { type: "string" },
              relevant: { type: "boolean" },
              why: { type: "string" },
            },
            required: ["signalId", "relevant", "why"],
          },
        },
      },
      required: ["assessments"],
    },
    maxTokens: 2500,
  });
}

// ---------- 9. Buyer Role Mapper ----------
export async function mapBuyerRoles({ businessDescription, criteria }) {
  return runSkill({
    system:
      "You are a B2B sales strategist. Identify which job titles at a target account are the economic " +
      "buyer, the champion/influencer, and the decision-maker for this specific product.",
    prompt: `Business:\n${businessDescription}\n\nICP criteria:\n${JSON.stringify(criteria, null, 2)}`,
    schema: {
      type: "object",
      properties: {
        targetTitles: { type: "array", items: { type: "string" }, description: "Flat list to search for in a contact database." },
        seniorities: { type: "array", items: { type: "string" }, description: "Apollo-style seniority buckets, e.g. 'director', 'vp', 'c_suite'." },
        roles: {
          type: "array",
          items: {
            type: "object",
            properties: {
              roleType: { type: "string", enum: ["decision_maker", "influencer", "champion"] },
              titles: { type: "array", items: { type: "string" } },
              why: { type: "string" },
            },
            required: ["roleType", "titles", "why"],
          },
        },
      },
      required: ["targetTitles", "seniorities", "roles"],
    },
    maxTokens: 1200,
  });
}

// ---------- 10. Contact Research Brief ----------
export async function writeContactBriefs({ businessDescription, contacts }) {
  if (!contacts.length) return { briefs: [] };
  return runSkill({
    system:
      "You are a sales researcher writing quick pre-call briefs. For each contact, note their likely " +
      "priorities in this role and how this business's product probably matters to them.",
    prompt:
      `Business:\n${businessDescription}\n\nContacts:\n` +
      JSON.stringify(
        contacts.map((c) => ({
          id: c.id,
          name: c.name,
          title: c.title,
          accountName: c.accountName,
          accountIndustry: c.accountIndustry,
          relevantSignals: c.relevantSignals,
        })),
        null,
        2
      ),
    schema: {
      type: "object",
      properties: {
        briefs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              contactId: { type: "string" },
              brief: { type: "string" },
              likelyPriorities: { type: "array", items: { type: "string" } },
            },
            required: ["contactId", "brief", "likelyPriorities"],
          },
        },
      },
      required: ["briefs"],
    },
    maxTokens: 3000,
  });
}

// ---------- 11. Account Priority Ranker ----------
export async function rankAccountPriority({ accounts }) {
  return runSkill({
    system:
      "You are a sales-ops analyst producing a work queue. Rank accounts by a mix of ICP fit score, " +
      "presence and freshness of relevant buying signals, and how quickly this deal could plausibly move.",
    prompt:
      "Accounts:\n" +
      JSON.stringify(
        accounts.map((a) => ({
          id: a.id,
          name: a.name,
          fitScore: a.fitScore,
          segment: a.segment,
          relevantSignalCount: (a.signals || []).filter((s) => s.relevant).length,
        })),
        null,
        2
      ),
    schema: {
      type: "object",
      properties: {
        ranking: {
          type: "array",
          items: {
            type: "object",
            properties: {
              accountId: { type: "string" },
              rank: { type: "integer" },
              priorityScore: { type: "integer", minimum: 0, maximum: 100 },
              rationale: { type: "string" },
            },
            required: ["accountId", "rank", "priorityScore", "rationale"],
          },
        },
      },
      required: ["ranking"],
    },
    maxTokens: 2500,
  });
}

// ---------- 12+13+14. Outreach Reason / Channel / Handoff ----------
// These three are modeled as separate skills (separate prompts + schemas,
// separately inspectable/editable) but run as one batched call per contact
// list rather than one call per contact, to keep pipeline runs fast and cheap.

export async function buildOutreachReasons({ businessDescription, contacts }) {
  if (!contacts.length) return { reasons: [] };
  return runSkill({
    system:
      "You write the one or two sentences a rep needs to explain, specifically, why they're reaching out " +
      "to this person right now. Ground it in the contact's role and the account's actual signals — no generic filler.",
    prompt:
      `Business:\n${businessDescription}\n\nContacts:\n` +
      JSON.stringify(
        contacts.map((c) => ({ id: c.id, name: c.name, title: c.title, accountName: c.accountName, brief: c.brief, relevantSignals: c.relevantSignals })),
        null,
        2
      ),
    schema: {
      type: "object",
      properties: {
        reasons: {
          type: "array",
          items: {
            type: "object",
            properties: { contactId: { type: "string" }, reason: { type: "string" } },
            required: ["contactId", "reason"],
          },
        },
      },
      required: ["reasons"],
    },
    maxTokens: 2000,
  });
}

export async function selectChannels({ contacts }) {
  if (!contacts.length) return { channels: [] };
  return runSkill({
    system:
      "You recommend the single best first-touch channel (email, linkedin, or phone) for each contact, " +
      "based on seniority and role. Senior/exec roles often prefer a sharp LinkedIn note or email over a cold call; " +
      "operational/technical roles are often more reachable by email.",
    prompt: "Contacts:\n" + JSON.stringify(contacts.map((c) => ({ id: c.id, title: c.title, seniority: c.seniority })), null, 2),
    schema: {
      type: "object",
      properties: {
        channels: {
          type: "array",
          items: {
            type: "object",
            properties: {
              contactId: { type: "string" },
              channel: { type: "string", enum: ["email", "linkedin", "phone"] },
              rationale: { type: "string" },
            },
            required: ["contactId", "channel", "rationale"],
          },
        },
      },
      required: ["channels"],
    },
    maxTokens: 1500,
  });
}

export async function writeHandoffPackets({ businessDescription, contacts }) {
  if (!contacts.length) return { handoffs: [] };
  return runSkill({
    system:
      "You prepare a clean lead-handoff packet for an AE or SDR — everything they need to make the first " +
      "touch without doing their own research first.",
    prompt:
      `Business:\n${businessDescription}\n\nContacts:\n` +
      JSON.stringify(
        contacts.map((c) => ({
          id: c.id,
          name: c.name,
          title: c.title,
          accountName: c.accountName,
          fitScore: c.fitScore,
          brief: c.brief,
          outreachReason: c.outreachReason,
          channel: c.channel,
          relevantSignals: c.relevantSignals,
        })),
        null,
        2
      ),
    schema: {
      type: "object",
      properties: {
        handoffs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              contactId: { type: "string" },
              summary: { type: "string" },
              talkingPoints: { type: "array", items: { type: "string" } },
              suggestedOpener: { type: "string" },
              recommendedNextStep: { type: "string" },
            },
            required: ["contactId", "summary", "talkingPoints", "suggestedOpener", "recommendedNextStep"],
          },
        },
      },
      required: ["handoffs"],
    },
    maxTokens: 3500,
  });
}

// ---------- 15. List Quality Auditor ----------
export async function auditListQuality({ accounts, contacts }) {
  return runSkill({
    system:
      "You are a data-quality auditor for a sales list. Flag accounts/contacts with weak fit, stale or " +
      "missing signals, or missing critical fields (email, title) before this list goes to sales.",
    prompt:
      "Accounts:\n" +
      JSON.stringify(accounts.map((a) => ({ id: a.id, name: a.name, fitScore: a.fitScore, excluded: a.excluded, signalCount: (a.signals || []).length })), null, 2) +
      "\n\nContacts:\n" +
      JSON.stringify(contacts.map((c) => ({ id: c.id, name: c.name, title: c.title, email: c.email, hasHandoff: Boolean(c.handoff) })), null, 2),
    schema: {
      type: "object",
      properties: {
        overallAssessment: { type: "string" },
        readyForHandoffCount: { type: "integer" },
        issues: {
          type: "array",
          items: {
            type: "object",
            properties: {
              entityType: { type: "string", enum: ["account", "contact"] },
              entityId: { type: "string" },
              issue: { type: "string" },
              severity: { type: "string", enum: ["low", "medium", "high"] },
            },
            required: ["entityType", "entityId", "issue", "severity"],
          },
        },
      },
      required: ["overallAssessment", "readyForHandoffCount", "issues"],
    },
    maxTokens: 2500,
  });
}
