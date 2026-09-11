// Thin wrapper around Apollo.io's v1 REST API. Callers bring their own
// workspace API key (set on the Settings page) — this ships as code the
// licensee runs against their own Apollo account, not a shared connection.
//
// Apollo has changed its accepted auth mechanism over time (a header vs. a
// body field); we send both so this keeps working either way.

import { SkillError } from "./anthropic.js";
import { getSettings } from "./store.js";

const BASE_URL = "https://api.apollo.io/v1";

async function apolloRequest(pathname, { method = "POST", body, query } = {}) {
  const settings = await getSettings();
  if (!settings.apolloApiKey) {
    throw new SkillError("No Apollo API key configured. Add one on the Settings page.");
  }

  const url = new URL(`${BASE_URL}${pathname}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "x-api-key": settings.apolloApiKey,
    },
    body: method === "GET" ? undefined : JSON.stringify({ api_key: settings.apolloApiKey, ...body }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new SkillError(`Apollo API error ${res.status} on ${pathname}: ${text.slice(0, 300)}`);
  }
  return res.json();
}

/**
 * Search organizations matching ICP-derived filters.
 * `filters` maps loosely to Apollo's organization_search params:
 *  - keywords: string[]  -> q_organization_keyword_tags
 *  - industries: string[] -> organization_industry_tag_ids / keywords fallback
 *  - locations: string[] -> organization_locations
 *  - employeeRanges: string[] like "11,50" -> organization_num_employees_ranges
 */
export async function searchOrganizations(filters, { page = 1, perPage = 25 } = {}) {
  const body = {
    page,
    per_page: perPage,
  };
  if (filters.keywords?.length) body.q_organization_keyword_tags = filters.keywords;
  if (filters.locations?.length) body.organization_locations = filters.locations;
  if (filters.employeeRanges?.length) body.organization_num_employees_ranges = filters.employeeRanges;

  const data = await apolloRequest("/mixed_companies/search", { body });
  const orgs = data.organizations || data.accounts || [];
  return orgs.map(normalizeOrganization);
}

export async function getOrganizationJobPostings(apolloOrgId) {
  if (!apolloOrgId) return [];
  try {
    const data = await apolloRequest(`/organizations/${apolloOrgId}/job_postings`, { method: "GET" });
    return data.organization_job_postings || data.job_postings || [];
  } catch {
    // Job postings are a nice-to-have signal, not a hard dependency — don't
    // fail the whole pipeline stage if this one lookup errors.
    return [];
  }
}

/**
 * Search people within a set of organizations for given target titles.
 */
export async function searchPeopleAtOrganizations({ apolloOrgIds, titles, seniorities }, { perPage = 5 } = {}) {
  if (!apolloOrgIds?.length) return [];
  const body = {
    organization_ids: apolloOrgIds,
    per_page: perPage,
  };
  if (titles?.length) body.person_titles = titles;
  if (seniorities?.length) body.person_seniorities = seniorities;

  const data = await apolloRequest("/mixed_people/search", { body });
  const people = data.people || data.contacts || [];
  return people.map(normalizePerson);
}

function normalizeOrganization(org) {
  return {
    apolloOrgId: org.id || org.organization_id,
    name: org.name,
    domain: org.primary_domain || org.website_url,
    industry: org.industry,
    employees: org.estimated_num_employees,
    location: [org.city, org.state, org.country].filter(Boolean).join(", "),
    linkedinUrl: org.linkedin_url,
    raw: org,
  };
}

function normalizePerson(person) {
  return {
    apolloPersonId: person.id,
    name: person.name || [person.first_name, person.last_name].filter(Boolean).join(" "),
    title: person.title,
    email: person.email,
    linkedinUrl: person.linkedin_url,
    seniority: person.seniority,
    apolloOrgId: person.organization_id,
    raw: person,
  };
}
