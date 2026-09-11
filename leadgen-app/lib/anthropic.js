import Anthropic from "@anthropic-ai/sdk";
import { getSettings } from "./store.js";

export class SkillError extends Error {}

let cachedClient = null;
let cachedKey = null;

async function getClient() {
  const settings = await getSettings();
  if (!settings.anthropicApiKey) {
    throw new SkillError(
      "No Anthropic API key configured. Add one on the Settings page."
    );
  }
  if (!cachedClient || cachedKey !== settings.anthropicApiKey) {
    cachedClient = new Anthropic({ apiKey: settings.anthropicApiKey });
    cachedKey = settings.anthropicApiKey;
  }
  return { client: cachedClient, model: settings.anthropicModel || "claude-sonnet-5" };
}

/**
 * Run one reasoning "skill": a system prompt + user payload, forced through
 * a tool call so the model must return JSON matching `schema` rather than
 * free text we'd have to parse hopefully.
 */
export async function runSkill({ system, prompt, schema, maxTokens = 2000 }) {
  const { client, model } = await getClient();

  const toolName = "return_result";
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: prompt }],
    tools: [
      {
        name: toolName,
        description: "Return the structured result of this analysis.",
        input_schema: schema,
      },
    ],
    tool_choice: { type: "tool", name: toolName },
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse) {
    throw new SkillError("Model did not return a structured result.");
  }
  return toolUse.input;
}
