import { NextResponse } from "next/server";
import { getCampaign, deleteCampaign } from "@/lib/store.js";

export async function GET(request, { params }) {
  const { id } = await params;
  const campaign = await getCampaign(id);
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ campaign });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await deleteCampaign(id);
  return NextResponse.json({ ok: true });
}
