// Minimal file-based JSON store.
//
// Deliberately has zero native dependencies (no sqlite bindings, no ORM) so
// the app runs anywhere Node runs — `npm run dev`, a plain VPS, a Docker
// container — with nothing to compile. Each campaign is one JSON file under
// data/campaigns/, plus a shared index and a settings file.
//
// This works well for a single-workspace, self-hosted deployment (the
// intended v1 shape — see README "Licensing this"). It assumes a
// persistent, writable filesystem: it will NOT work on stateless serverless
// platforms (e.g. Vercel's default runtime), since writes vanish between
// invocations. Swap this module for a Postgres-backed one to run there or
// to go multi-tenant — every call site goes through this file only.

import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const CAMPAIGNS_DIR = path.join(DATA_DIR, "campaigns");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");
const INDEX_FILE = path.join(DATA_DIR, "campaigns-index.json");

// Serialize writes per file so two concurrent requests never interleave and
// corrupt a JSON file. Good enough for a single-process self-hosted app.
const locks = new Map();
async function withLock(key, fn) {
  const prior = locks.get(key) || Promise.resolve();
  let release;
  const next = new Promise((resolve) => (release = resolve));
  locks.set(
    key,
    prior.then(() => next)
  );
  await prior;
  try {
    return await fn();
  } finally {
    release();
  }
}

async function ensureDirs() {
  await fs.mkdir(CAMPAIGNS_DIR, { recursive: true });
}

async function readJson(file, fallback) {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === "ENOENT") return fallback;
    throw err;
  }
}

async function writeJson(file, data) {
  await ensureDirs();
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf-8");
  await fs.rename(tmp, file);
}

// ---------- settings ----------

const DEFAULT_SETTINGS = {
  anthropicApiKey: "",
  anthropicModel: "claude-sonnet-5",
  apolloApiKey: "",
  clayWebhookUrl: "",
  clayInboundSecret: "",
  maxAccounts: 15,
  maxContactsPerAccount: 2,
};

export async function getSettings() {
  const stored = await readJson(SETTINGS_FILE, {});
  const env = {
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || "",
    anthropicModel: process.env.ANTHROPIC_MODEL || "",
    apolloApiKey: process.env.APOLLO_API_KEY || "",
    clayWebhookUrl: process.env.CLAY_WEBHOOK_URL || "",
    clayInboundSecret: process.env.CLAY_INBOUND_SECRET || "",
  };
  // Precedence, low to high: built-in defaults < env vars (if set) < a value
  // saved via the Settings UI (if set).
  const merged = { ...DEFAULT_SETTINGS };
  for (const [k, v] of Object.entries(env)) if (v) merged[k] = v;
  for (const [k, v] of Object.entries(stored)) if (v !== "" && v !== undefined && v !== null) merged[k] = v;
  return merged;
}

export async function saveSettings(patch) {
  return withLock(SETTINGS_FILE, async () => {
    const current = await readJson(SETTINGS_FILE, {});
    const next = { ...current, ...patch };
    await writeJson(SETTINGS_FILE, next);
    return getSettings();
  });
}

// ---------- campaigns ----------

function campaignFile(id) {
  return path.join(CAMPAIGNS_DIR, `${id}.json`);
}

export async function listCampaigns() {
  const index = await readJson(INDEX_FILE, []);
  return [...index].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function updateIndex(entry) {
  return withLock(INDEX_FILE, async () => {
    const index = await readJson(INDEX_FILE, []);
    const i = index.findIndex((c) => c.id === entry.id);
    if (i === -1) index.push(entry);
    else index[i] = entry;
    await writeJson(INDEX_FILE, index);
  });
}

export async function getCampaign(id) {
  return readJson(campaignFile(id), null);
}

export async function saveCampaign(campaign) {
  campaign.updatedAt = new Date().toISOString();
  return withLock(campaignFile(campaign.id), async () => {
    await writeJson(campaignFile(campaign.id), campaign);
    await updateIndex({
      id: campaign.id,
      name: campaign.name,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
      status: campaign.status,
    });
    return campaign;
  });
}

export async function createCampaign({ name, businessDescription, bestCustomersRaw }) {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const campaign = {
    id,
    name,
    businessDescription,
    bestCustomersRaw,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    stages: {}, // stageKey -> { status, input, output, error, startedAt, finishedAt }
    accounts: [], // [{ id, name, domain, industry, employees, location, apolloOrgId, segment, fitScore, fitReasons, excluded, signals, priorityRank, priorityRationale }]
    contacts: [], // [{ id, accountId, name, title, email, linkedin, roleType, brief, outreachReason, channel, channelRationale, handoff }]
  };
  await saveCampaign(campaign);
  return campaign;
}

export async function deleteCampaign(id) {
  await withLock(campaignFile(id), async () => {
    try {
      await fs.unlink(campaignFile(id));
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
  });
  await withLock(INDEX_FILE, async () => {
    const index = await readJson(INDEX_FILE, []);
    await writeJson(
      INDEX_FILE,
      index.filter((c) => c.id !== id)
    );
  });
}

export function newId() {
  return crypto.randomUUID();
}
