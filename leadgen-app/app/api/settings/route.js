import { NextResponse } from "next/server";
import { getSettings, saveSettings } from "@/lib/store.js";

const SECRET_FIELDS = ["anthropicApiKey", "apolloApiKey", "clayInboundSecret"];

function mask(value) {
  if (!value) return "";
  if (value.length <= 4) return "••••";
  return `••••${value.slice(-4)}`;
}

export async function GET() {
  const settings = await getSettings();
  const safe = { ...settings };
  for (const field of SECRET_FIELDS) {
    safe[`${field}Set`] = Boolean(settings[field]);
    safe[field] = mask(settings[field]);
  }
  return NextResponse.json(safe);
}

export async function PUT(request) {
  const body = await request.json();
  const patch = {};
  for (const [key, value] of Object.entries(body)) {
    if (SECRET_FIELDS.includes(key)) {
      // Empty/untouched (still masked) values mean "leave as-is".
      if (typeof value === "string" && value && !value.startsWith("••••")) {
        patch[key] = value;
      }
      continue;
    }
    patch[key] = value;
  }
  const updated = await saveSettings(patch);
  const safe = { ...updated };
  for (const field of SECRET_FIELDS) {
    safe[`${field}Set`] = Boolean(updated[field]);
    safe[field] = mask(updated[field]);
  }
  return NextResponse.json(safe);
}
