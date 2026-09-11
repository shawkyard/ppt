import { NextResponse } from "next/server";
import { listCampaigns, createCampaign } from "@/lib/store.js";

export async function GET() {
  const campaigns = await listCampaigns();
  return NextResponse.json({ campaigns });
}

export async function POST(request) {
  const body = await request.json();
  const { name, businessDescription, bestCustomersRaw } = body;
  if (!name?.trim() || !businessDescription?.trim() || !bestCustomersRaw?.trim()) {
    return NextResponse.json(
      { error: "name, businessDescription, and bestCustomersRaw are all required." },
      { status: 400 }
    );
  }
  const campaign = await createCampaign({ name: name.trim(), businessDescription: businessDescription.trim(), bestCustomersRaw: bestCustomersRaw.trim() });
  return NextResponse.json({ campaign }, { status: 201 });
}
