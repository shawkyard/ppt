import { PacketMode, Screenshot } from "../types";
import { formatDateTime } from "./format";

export interface ModeMeta {
  id: PacketMode;
  title: string;
  tagline: string;
  blurb: string;
  icon: string; // key used by <Icon />
  minShots?: number;
}

export const MODES: ModeMeta[] = [
  {
    id: "boss",
    title: "Ask Boss AI",
    tagline: "Get direction from ChatGPT or Claude",
    blurb:
      "For when you want a smart model to look at your screenshots and tell you the next best move.",
    icon: "brain",
  },
  {
    id: "builder",
    title: "Send to Builder AI",
    tagline: "Brief Manus, Lovable, v0, Bolt, Framer…",
    blurb:
      "Turn screenshots into a precise build instruction for an AI app builder.",
    icon: "hammer",
  },
  {
    id: "fix",
    title: "Fix This Website",
    tagline: "Improve a page, app screen, or design",
    blurb:
      "For screenshots of a website, landing page, or UI you want critiqued and fixed.",
    icon: "wand",
  },
  {
    id: "error",
    title: "Explain This Error",
    tagline: "Debug an error, deploy, DNS, or config",
    blurb:
      "For error messages, stack traces, failed deploys, GitHub, Cloudflare, or DNS issues.",
    icon: "bug",
  },
  {
    id: "client",
    title: "Client Reply",
    tagline: "Draft a professional response",
    blurb:
      "For a client message, email, review, or lead you need to reply to well.",
    icon: "chat",
  },
  {
    id: "compare",
    title: "Compare Screenshots",
    tagline: "Before/after or option A vs B",
    blurb:
      "Select two or more screenshots to compare versions or weigh options.",
    icon: "compare",
    minShots: 2,
  },
];

export function modeMeta(mode: PacketMode): ModeMeta {
  return MODES.find((m) => m.id === mode) ?? MODES[0];
}

function screenshotList(shots: Screenshot[]): string {
  if (shots.length === 0) {
    return "_(No screenshots selected — attach the relevant images below.)_";
  }
  return shots
    .map(
      (s, i) =>
        `${i + 1}. **${s.fileName}** — ${formatDateTime(
          s.createdAt
        )} _(source: ${sourceLabel(s.source)})_`
    )
    .join("\n");
}

function sourceLabel(source: Screenshot["source"]): string {
  switch (source) {
    case "clipboard":
      return "clipboard";
    case "folder":
      return "watched folder";
    default:
      return "manual upload";
  }
}

function contextBlock(note: string): string {
  const trimmed = note.trim();
  return trimmed.length
    ? trimmed
    : "_(No note added — infer intent from the screenshots.)_";
}

const ATTACH_REMINDER =
  "> ⚠️ **Attach the screenshots.** PromptShot builds the words — you still " +
  "paste or upload the actual images alongside this packet so the AI can see them.";

/**
 * Build the full copy/paste markdown packet for a mode. Each mode has its own
 * Goal / Instructions / Output blocks so the receiving AI gets a purpose-built
 * brief instead of a generic one.
 */
export function generatePacket(
  mode: PacketMode,
  note: string,
  shots: Screenshot[]
): string {
  const meta = modeMeta(mode);
  const count = shots.length;
  const list = screenshotList(shots);
  const ctx = contextBlock(note);

  const header = [
    `# PromptShot AI Handoff Packet`,
    ``,
    `**Mode:** ${meta.title} · **Screenshots:** ${count}`,
    ``,
    ATTACH_REMINDER,
    ``,
  ].join("\n");

  const screenshotsSection = [
    `## Screenshots Included`,
    ``,
    list,
    ``,
  ].join("\n");

  const contextSection = [`## Context`, ``, ctx, ``].join("\n");

  const body = bodyFor(mode, ctx);

  return [header, goalFor(mode), ``, contextSection, screenshotsSection, body]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function goalFor(mode: PacketMode): string {
  const goals: Record<PacketMode, string> = {
    boss:
      "## Goal\n\nLook at the attached screenshots and tell me the single best next action to take.",
    builder:
      "## Goal\n\nTurn the attached screenshots into a precise, buildable instruction I can hand to an AI app builder.",
    fix:
      "## Goal\n\nReview the attached screenshots of my website/app and give me concrete fixes that improve it.",
    error:
      "## Goal\n\nDiagnose the problem shown in the attached screenshots and give me an exact fix.",
    client:
      "## Goal\n\nHelp me write a professional, on-point reply to the message shown in the attached screenshots.",
    compare:
      "## Goal\n\nCompare the attached screenshots and tell me which is better and why.",
  };
  return goals[mode];
}

function bodyFor(mode: PacketMode, ctx: string): string {
  switch (mode) {
    case "boss":
      return section(
        "Instructions",
        [
          "Review every screenshot carefully before answering.",
          "Identify what I am actually trying to accomplish (see Context).",
          "Think about what matters most and what I might be missing.",
        ]
      ).concat(
        outputList([
          "What the screenshots show (1–2 lines).",
          "What matters most right now.",
          "Any problems, risks, or blockers you notice.",
          "The exact next step I should take.",
          "A ready-to-paste prompt for the next AI tool that will do that step.",
        ])
      );

    case "builder":
      return section("Instructions", [
        "Treat the screenshots as the target design / desired outcome.",
        "Be concrete and unambiguous — the receiving AI cannot ask follow-ups.",
        "Assume a modern web stack unless the Context says otherwise.",
      ]).concat(
        outputList([
          "A one-paragraph summary of what to build.",
          "A structured build spec: layout, components, states, and data.",
          "Exact copy/text to use where visible in the screenshots.",
          "Styling notes (colors, spacing, typography) inferred from the images.",
          "A single clean prompt block I can paste directly into Lovable / v0 / Bolt / Manus.",
        ])
      );

    case "fix":
      return section("Instructions", [
        "Critique the design and UX shown in the screenshots honestly.",
        "Prioritize changes by impact — biggest wins first.",
        "Keep suggestions specific enough to act on immediately.",
      ]).concat(
        outputList([
          "First impression: what works and what doesn't.",
          "Top 5 concrete fixes, ranked by impact.",
          "Any accessibility, layout, or conversion issues.",
          "Suggested copy or CTA improvements if relevant.",
          "A prompt I can give an AI builder to apply these fixes.",
        ])
      );

    case "error":
      return section("Instructions", [
        "Read the error text/stack in the screenshots precisely.",
        "State the most likely root cause before proposing fixes.",
        "If more than one cause is possible, rank them by likelihood.",
      ]).concat(
        outputList([
          "Plain-English explanation of what the error means.",
          "The most likely root cause.",
          "Step-by-step fix (commands / settings / code as needed).",
          "How to verify it's actually resolved.",
          "How to prevent it from happening again.",
        ])
      );

    case "client":
      return section("Instructions", [
        "Read the client's message and tone in the screenshots.",
        "Match a warm, competent, professional voice.",
        `Keep my goal in mind: ${ctx.startsWith("_(") ? "close/advance the conversation positively" : "see Context above"}.`,
      ]).concat(
        outputList([
          "A 1-line read on what the client wants and how they feel.",
          "A ready-to-send reply (professional, concise, friendly).",
          "A shorter alternative version.",
          "Any risk or thing I should be careful about.",
          "Suggested next step to move the relationship forward.",
        ])
      );

    case "compare":
      return section("Instructions", [
        "Treat the screenshots as options or before/after states to compare.",
        "Judge against my goal in the Context, not generic preference.",
        "Be decisive — pick a winner, don't sit on the fence.",
      ]).concat(
        outputList([
          "A quick side-by-side of the key differences.",
          "Pros and cons of each screenshot.",
          "Which one is better and exactly why.",
          "What to borrow from the loser to improve the winner.",
          "A prompt for the next AI tool to implement the chosen direction.",
        ])
      );
  }
}

function section(title: string, bullets: string[]): string {
  return [`## ${title}`, ``, ...bullets.map((b) => `- ${b}`), ``].join("\n");
}

function outputList(items: string[]): string {
  return [
    `## Output Required`,
    ``,
    ...items.map((it, i) => `${i + 1}. ${it}`),
    ``,
    `---`,
    `_Generated with PromptShot — the missing clipboard between AI tools._`,
  ].join("\n");
}
