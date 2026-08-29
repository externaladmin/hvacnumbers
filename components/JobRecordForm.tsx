"use client";

import { useState, type FormEvent } from "react";
import type { StaticPressureInputs, StaticPressureResult } from "@/lib/calculations";
import { trackEvent } from "@/components/GoogleAnalytics";

interface Props {
  inputs: StaticPressureInputs;
  result: StaticPressureResult;
}

type Status = "idle" | "submitting" | "success" | "error";

export default function JobRecordForm({ inputs, result }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [siteAddress, setSiteAddress] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/job-record", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          email,
          siteAddress: siteAddress || undefined,
          supplyStatic: inputs.supplyStatic,
          returnStatic: inputs.returnStatic,
          filterDrop: inputs.filterDrop,
          coilDrop: inputs.coilDrop,
          espResult: result.esp,
          resultInterpretation: result.interpretation,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      trackEvent("job_record_saved", { esp_status: result.status });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="card">
        <div className="confirmation">
          Saved. We&rsquo;ve emailed a copy of this job record to {email}.
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="section-title">Save this job record</h2>
      <p className="section-subtitle">
        Enter your email and we&rsquo;ll send you a copy with your inputs, result, and
        date.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="name">Name (optional)</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="field">
          <label htmlFor="siteAddress">Site address (optional)</label>
          <input
            id="siteAddress"
            type="text"
            value={siteAddress}
            onChange={(e) => setSiteAddress(e.target.value)}
            autoComplete="street-address"
          />
        </div>
        <button className="btn" type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Saving…" : "Save job record"}
        </button>
        {status === "error" && <p className="error-text">{errorMessage}</p>}
      </form>
    </div>
  );
}
