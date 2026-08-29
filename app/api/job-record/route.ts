import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { renderJobRecordEmail } from "@/lib/email-template";
import { addBeehiivSubscriber } from "@/lib/beehiiv";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BEEHIIV_TAG = "hvacnumbers-static-pressure";

interface JobRecordPayload {
  name?: string;
  email: string;
  siteAddress?: string;
  supplyStatic: number;
  returnStatic: number;
  filterDrop: number;
  coilDrop: number;
  espResult: number;
  resultInterpretation: string;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function validate(body: unknown): { ok: true; data: JobRecordPayload } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Invalid request body." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.email !== "string" || !EMAIL_RE.test(b.email.trim())) {
    return { ok: false, error: "A valid email address is required." };
  }

  const numericFields: (keyof JobRecordPayload)[] = [
    "supplyStatic",
    "returnStatic",
    "filterDrop",
    "coilDrop",
    "espResult",
  ];
  for (const field of numericFields) {
    if (!isFiniteNumber(b[field])) {
      return { ok: false, error: `Missing or invalid value for ${field}.` };
    }
  }

  if (typeof b.resultInterpretation !== "string" || !b.resultInterpretation.trim()) {
    return { ok: false, error: "Missing result interpretation." };
  }

  if (b.name !== undefined && typeof b.name !== "string") {
    return { ok: false, error: "Invalid name." };
  }
  if (b.siteAddress !== undefined && typeof b.siteAddress !== "string") {
    return { ok: false, error: "Invalid site address." };
  }

  return {
    ok: true,
    data: {
      email: b.email.trim(),
      name: typeof b.name === "string" ? b.name.trim() || undefined : undefined,
      siteAddress:
        typeof b.siteAddress === "string" ? b.siteAddress.trim() || undefined : undefined,
      supplyStatic: b.supplyStatic as number,
      returnStatic: b.returnStatic as number,
      filterDrop: b.filterDrop as number,
      coilDrop: b.coilDrop as number,
      espResult: b.espResult as number,
      resultInterpretation: (b.resultInterpretation as string).trim(),
    },
  };
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validated = validate(body);
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }
  const data = validated.data;
  const createdAt = new Date().toISOString();

  const { error: insertError } = await supabase.from("job_records").insert({
    email: data.email,
    name: data.name ?? null,
    site_address: data.siteAddress ?? null,
    supply_static: data.supplyStatic,
    return_static: data.returnStatic,
    filter_drop: data.filterDrop,
    coil_drop: data.coilDrop,
    esp_result: data.espResult,
    result_interpretation: data.resultInterpretation,
  });

  if (insertError) {
    console.error("Supabase insert failed:", insertError);
    return NextResponse.json(
      { error: "Could not save your job record. Please try again." },
      { status: 500 }
    );
  }

  let emailSent = false;
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const { subject, html, text } = renderJobRecordEmail({
        name: data.name,
        siteAddress: data.siteAddress,
        supplyStatic: data.supplyStatic,
        returnStatic: data.returnStatic,
        filterDrop: data.filterDrop,
        coilDrop: data.coilDrop,
        espResult: data.espResult,
        resultInterpretation: data.resultInterpretation,
        createdAt,
      });
      const { error: sendError } = await resend.emails.send({
        from: process.env.RESEND_FROM_ADDRESS || "records@hvacnumbers.com",
        to: data.email,
        subject,
        html,
        text,
      });
      emailSent = !sendError;
      if (sendError) console.error("Resend send failed:", sendError);
    } catch (error) {
      console.error("Resend send threw:", error);
    }
  }

  const beehiivSynced = await addBeehiivSubscriber(data.email, BEEHIIV_TAG);

  const { error: subscriberError } = await supabase.from("subscribers").upsert(
    {
      email: data.email,
      source: "static-pressure",
      beehiiv_synced: beehiivSynced,
    },
    { onConflict: "email" }
  );
  if (subscriberError) {
    console.error("Supabase subscriber upsert failed:", subscriberError);
  }

  return NextResponse.json({ ok: true, emailSent, beehiivSynced });
}
