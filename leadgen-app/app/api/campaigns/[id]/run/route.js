import { NextResponse } from "next/server";
import { runStage, PipelineError } from "@/lib/pipeline.js";
import { SkillError } from "@/lib/anthropic.js";

export async function POST(request, { params }) {
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const { stage } = body;
  if (!stage) return NextResponse.json({ error: "Missing 'stage' in request body." }, { status: 400 });

  try {
    const campaign = await runStage(id, stage);
    return NextResponse.json({ campaign });
  } catch (err) {
    if (err instanceof PipelineError || err instanceof SkillError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Unexpected error running stage: " + (err.message || String(err)) }, { status: 500 });
  }
}
