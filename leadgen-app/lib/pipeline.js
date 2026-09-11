// Orchestrates the 15 stages against a single campaign: enforces stage
// order, calls the right mix of skills.js (Claude) / apollo.js / clay.js,
// and persists results onto the campaign document via store.js.

import { getCampaign, saveCampaign, newId, getSettings } from "./store.js";
import {
  STAGES,
  analyseBestCustomers,
  buildIcpCriteria,
  buildExclusionRules,
  deriveApolloFilters,
  mapMarketSegments,
  scoreAccountFit,
  checkSignalRelevance,
  mapBuyerRoles,
  writeContactBriefs,
  rankAccountPriority,
  buildOutreachReasons,
  selectChannels,
  writeHandoffPackets,
  auditListQuality,
} from "./skills.js";
import { searchOrganizations, getOrganizationJobPostings, searchPeopleAtOrganizations } from "./apollo.js";
import { isClayConfigured, pushToClay } from "./clay.js";

const STAGE_ORDER = STAGES.map((s) => s.key);

export class PipelineError extends Error {}

const handlers = {
  async bestCustomerAnalyser(campaign) {
    const output = await analyseBestCustomers({
      businessDescription: campaign.businessDescription,
      bestCustomersRaw: campaign.bestCustomersRaw,
    });
    return { output };
  },

  async icpCriteriaBuilder(campaign) {
    const patterns = campaign.stages.bestCustomerAnalyser.output.patterns;
    const output = await buildIcpCriteria({ businessDescription: campaign.businessDescription, patterns });
    return { output };
  },

  async exclusionRuleBuilder(campaign) {
    const { criteria, mustHaves } = campaign.stages.icpCriteriaBuilder.output;
    const output = await buildExclusionRules({ businessDescription: campaign.businessDescription, criteria, mustHaves });
    return { output };
  },

  async lookalikeAccountResearcher(campaign, settings) {
    const { criteria, mustHaves } = campaign.stages.icpCriteriaBuilder.output;
    const filters = await deriveApolloFilters({ criteria, mustHaves });
    const orgs = await searchOrganizations(filters, { perPage: settings.maxAccounts });
    const accounts = orgs.slice(0, settings.maxAccounts).map((o) => ({
      id: newId(),
      ...o,
      segment: null,
      fitScore: null,
      fitReasons: [],
      excluded: false,
      exclusionReason: null,
      signals: [],
      priorityRank: null,
      priorityScore: null,
      priorityRationale: null,
    }));
    if (!accounts.length) {
      throw new PipelineError(
        "Apollo returned no matching organizations for the derived filters. Try broadening the best-customer notes, or check the Apollo API key."
      );
    }
    return { output: { filters, count: accounts.length }, accounts };
  },

  async marketSegmentMapper(campaign) {
    const output = await mapMarketSegments({ accounts: campaign.accounts });
    const segByAccount = {};
    for (const seg of output.segments) for (const id of seg.accountIds) segByAccount[id] = seg.name;
    const accounts = campaign.accounts.map((a) => ({ ...a, segment: segByAccount[a.id] || a.segment || "Unsegmented" }));
    return { output, accounts };
  },

  async accountFitScorer(campaign) {
    const { criteria } = campaign.stages.icpCriteriaBuilder.output;
    const { rules } = campaign.stages.exclusionRuleBuilder.output;
    const output = await scoreAccountFit({ accounts: campaign.accounts, criteria, exclusionRules: rules });
    const byId = Object.fromEntries(output.scores.map((s) => [s.accountId, s]));
    const accounts = campaign.accounts.map((a) => {
      const s = byId[a.id];
      if (!s) return a;
      return { ...a, fitScore: s.score, fitReasons: s.reasons, excluded: Boolean(s.excluded), exclusionReason: s.exclusionReason || null };
    });
    return { output, accounts };
  },

  async buyingSignalFinder(campaign) {
    const candidates = [...campaign.accounts].filter((a) => !a.excluded).sort((a, b) => (b.fitScore || 0) - (a.fitScore || 0));

    const signalsByAccount = {};
    for (const acc of candidates) {
      const postings = await getOrganizationJobPostings(acc.apolloOrgId);
      const signals = postings.slice(0, 5).map((p) => ({
        id: newId(),
        type: "hiring",
        detail: p.title || p.name || "Open role posted",
        postedAt: p.posted_at || p.date_posted || null,
        relevant: null,
        why: null,
      }));
      if (signals.length) signalsByAccount[acc.id] = signals;
    }

    let clayPush = { pushed: 0 };
    if (await isClayConfigured()) {
      clayPush = await pushToClay(
        candidates.map((a) => ({ campaignId: campaign.id, entityType: "account", entityId: a.id, name: a.name, domain: a.domain }))
      );
    }

    const accounts = campaign.accounts.map((a) => (signalsByAccount[a.id] ? { ...a, signals: [...(a.signals || []), ...signalsByAccount[a.id]] } : a));
    const signalCount = Object.values(signalsByAccount).reduce((n, arr) => n + arr.length, 0);
    return { output: { signalCount, clayConfigured: await isClayConfigured(), clayPush }, accounts };
  },

  async signalRelevanceChecker(campaign) {
    const allSignals = campaign.accounts.flatMap((a) => (a.signals || []).map((s) => ({ signalId: s.id, accountName: a.name, type: s.type, detail: s.detail })));
    const output = await checkSignalRelevance({ businessDescription: campaign.businessDescription, signals: allSignals });
    const byId = Object.fromEntries(output.assessments.map((a) => [a.signalId, a]));
    const accounts = campaign.accounts.map((acc) => ({
      ...acc,
      signals: (acc.signals || []).map((s) => (byId[s.id] ? { ...s, relevant: byId[s.id].relevant, why: byId[s.id].why } : s)),
    }));
    return { output, accounts };
  },

  async buyerRoleMapper(campaign) {
    const { criteria } = campaign.stages.icpCriteriaBuilder.output;
    const output = await mapBuyerRoles({ businessDescription: campaign.businessDescription, criteria });
    return { output };
  },

  async contactResearchBrief(campaign, settings) {
    const { targetTitles, seniorities } = campaign.stages.buyerRoleMapper.output;
    const activeAccounts = campaign.accounts.filter((a) => !a.excluded && a.apolloOrgId);

    let contacts = [];
    if (activeAccounts.length) {
      const apolloOrgIds = activeAccounts.map((a) => a.apolloOrgId);
      const raw = await searchPeopleAtOrganizations(
        { apolloOrgIds, titles: targetTitles, seniorities },
        { perPage: Math.max(10, settings.maxContactsPerAccount * activeAccounts.length) }
      );
      const perOrgCount = {};
      for (const p of raw) {
        perOrgCount[p.apolloOrgId] = (perOrgCount[p.apolloOrgId] || 0) + 1;
        if (perOrgCount[p.apolloOrgId] > settings.maxContactsPerAccount) continue;
        const account = activeAccounts.find((a) => a.apolloOrgId === p.apolloOrgId);
        if (!account) continue;
        contacts.push({
          id: newId(),
          accountId: account.id,
          accountName: account.name,
          accountIndustry: account.industry,
          name: p.name,
          title: p.title,
          email: p.email,
          linkedinUrl: p.linkedinUrl,
          seniority: p.seniority,
          roleType: null,
          brief: null,
          likelyPriorities: [],
          outreachReason: null,
          channel: null,
          channelRationale: null,
          handoff: null,
        });
      }
    }

    if (await isClayConfigured()) {
      await pushToClay(contacts.map((c) => ({ campaignId: campaign.id, entityType: "contact", entityId: c.id, name: c.name, email: c.email, accountName: c.accountName })));
    }

    const signalsByAccount = Object.fromEntries(
      campaign.accounts.map((a) => [a.id, (a.signals || []).filter((s) => s.relevant).map((s) => s.detail)])
    );
    const briefInputs = contacts.map((c) => ({ ...c, relevantSignals: signalsByAccount[c.accountId] || [] }));
    const { briefs } = await writeContactBriefs({ businessDescription: campaign.businessDescription, contacts: briefInputs });
    const briefById = Object.fromEntries(briefs.map((b) => [b.contactId, b]));

    contacts = contacts.map((c) => ({
      ...c,
      relevantSignals: signalsByAccount[c.accountId] || [],
      brief: briefById[c.id]?.brief || null,
      likelyPriorities: briefById[c.id]?.likelyPriorities || [],
    }));

    return { output: { contactCount: contacts.length }, contacts };
  },

  async accountPriorityRanker(campaign) {
    const active = campaign.accounts.filter((a) => !a.excluded);
    const { ranking } = await rankAccountPriority({ accounts: active });
    const byId = Object.fromEntries(ranking.map((r) => [r.accountId, r]));
    const accounts = campaign.accounts.map((a) => {
      const r = byId[a.id];
      return r ? { ...a, priorityRank: r.rank, priorityScore: r.priorityScore, priorityRationale: r.rationale } : a;
    });
    return { output: { ranking }, accounts };
  },

  async outreachReasonBuilder(campaign) {
    const { reasons } = await buildOutreachReasons({ businessDescription: campaign.businessDescription, contacts: campaign.contacts });
    const byId = Object.fromEntries(reasons.map((r) => [r.contactId, r]));
    const contacts = campaign.contacts.map((c) => (byId[c.id] ? { ...c, outreachReason: byId[c.id].reason } : c));
    return { output: { count: reasons.length }, contacts };
  },

  async channelSelector(campaign) {
    const { channels } = await selectChannels({ contacts: campaign.contacts });
    const byId = Object.fromEntries(channels.map((c) => [c.contactId, c]));
    const contacts = campaign.contacts.map((c) => (byId[c.id] ? { ...c, channel: byId[c.id].channel, channelRationale: byId[c.id].rationale } : c));
    return { output: { count: channels.length }, contacts };
  },

  async leadHandoffWriter(campaign) {
    const accountsById = Object.fromEntries(campaign.accounts.map((a) => [a.id, a]));
    const enriched = campaign.contacts.map((c) => ({ ...c, fitScore: accountsById[c.accountId]?.fitScore }));
    const { handoffs } = await writeHandoffPackets({ businessDescription: campaign.businessDescription, contacts: enriched });
    const byId = Object.fromEntries(handoffs.map((h) => [h.contactId, h]));
    const contacts = campaign.contacts.map((c) => (byId[c.id] ? { ...c, handoff: byId[c.id] } : c));
    return { output: { count: handoffs.length }, contacts };
  },

  async listQualityAuditor(campaign) {
    const output = await auditListQuality({ accounts: campaign.accounts, contacts: campaign.contacts });
    return { output };
  },
};

export function getNextRunnableStage(campaign) {
  for (const key of STAGE_ORDER) {
    const status = campaign.stages[key]?.status;
    if (status !== "done") return key;
  }
  return null;
}

export async function runStage(campaignId, stageKey) {
  if (!handlers[stageKey]) throw new PipelineError(`Unknown stage: ${stageKey}`);

  const campaign = await getCampaign(campaignId);
  if (!campaign) throw new PipelineError("Campaign not found");

  const idx = STAGE_ORDER.indexOf(stageKey);
  const priorKey = STAGE_ORDER[idx - 1];
  if (priorKey && campaign.stages[priorKey]?.status !== "done") {
    throw new PipelineError(`Run "${priorKey}" before "${stageKey}".`);
  }

  const settings = await getSettings();

  campaign.stages[stageKey] = { ...(campaign.stages[stageKey] || {}), status: "running", startedAt: new Date().toISOString(), error: null };
  campaign.status = "running";
  await saveCampaign(campaign);

  try {
    const result = await handlers[stageKey](campaign, settings);
    campaign.stages[stageKey] = {
      status: "done",
      startedAt: campaign.stages[stageKey].startedAt,
      finishedAt: new Date().toISOString(),
      output: result.output,
      error: null,
    };
    if (result.accounts) campaign.accounts = result.accounts;
    if (result.contacts) campaign.contacts = result.contacts;
    campaign.status = getNextRunnableStage(campaign) ? "in_progress" : "complete";
    await saveCampaign(campaign);
    return campaign;
  } catch (err) {
    campaign.stages[stageKey] = {
      ...campaign.stages[stageKey],
      status: "error",
      finishedAt: new Date().toISOString(),
      error: err.message || String(err),
    };
    campaign.status = "error";
    await saveCampaign(campaign);
    throw err;
  }
}
