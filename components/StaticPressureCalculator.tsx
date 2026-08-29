"use client";

import { useState, type FormEvent } from "react";
import {
  calculateStaticPressure,
  type StaticPressureInputs,
  type StaticPressureResult,
} from "@/lib/calculations";
import ResultCard from "@/components/ResultCard";
import JobRecordForm from "@/components/JobRecordForm";
import ShareCard from "@/components/ShareCard";
import { trackEvent } from "@/components/GoogleAnalytics";

interface FieldConfig {
  key: keyof StaticPressureInputs;
  label: string;
  hint: string;
}

const FIELDS: FieldConfig[] = [
  {
    key: "supplyStatic",
    label: "Supply static pressure",
    hint: "Reading on the supply side of the air handler, in inches w.c.",
  },
  {
    key: "returnStatic",
    label: "Return static pressure",
    hint: "Reading on the return side of the air handler, in inches w.c.",
  },
  {
    key: "filterDrop",
    label: "Filter drop",
    hint: "Pressure drop across the filter, in inches w.c.",
  },
  {
    key: "coilDrop",
    label: "Coil drop",
    hint: "Pressure drop across the coil, in inches w.c.",
  },
];

type RawInputs = Record<keyof StaticPressureInputs, string>;

const EMPTY_INPUTS: RawInputs = {
  supplyStatic: "",
  returnStatic: "",
  filterDrop: "",
  coilDrop: "",
};

export default function StaticPressureCalculator() {
  const [raw, setRaw] = useState<RawInputs>(EMPTY_INPUTS);
  const [result, setResult] = useState<StaticPressureResult | null>(null);
  const [inputs, setInputs] = useState<StaticPressureInputs | null>(null);
  const [formError, setFormError] = useState("");

  function handleChange(key: keyof StaticPressureInputs, value: string) {
    setRaw((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    const parsed: Partial<StaticPressureInputs> = {};
    for (const field of FIELDS) {
      const value = raw[field.key].trim();
      if (value === "") {
        setFormError("Enter all four readings to calculate ESP.");
        return;
      }
      const num = Number(value);
      if (!Number.isFinite(num)) {
        setFormError(`"${value}" isn't a valid number for ${field.label.toLowerCase()}.`);
        return;
      }
      parsed[field.key] = num;
    }

    const nextInputs = parsed as StaticPressureInputs;
    const nextResult = calculateStaticPressure(nextInputs);
    setInputs(nextInputs);
    setResult(nextResult);
    trackEvent("esp_calculated", { esp_status: nextResult.status });
  }

  return (
    <>
      <div className="card">
        <h1 className="section-title" style={{ fontSize: 18 }}>
          Static Pressure Calculator
        </h1>
        <p className="section-subtitle">
          Enter your readings to get external static pressure (ESP) instantly.
        </p>
        <form onSubmit={handleSubmit}>
          {FIELDS.map((field) => (
            <div className="field" key={field.key}>
              <label htmlFor={field.key}>{field.label} (in. w.c.)</label>
              <input
                id={field.key}
                type="number"
                inputMode="decimal"
                step="0.01"
                placeholder="0.00"
                value={raw[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
              <p className="hint">{field.hint}</p>
            </div>
          ))}
          <button className="btn" type="submit">
            Calculate ESP
          </button>
          {formError && <p className="error-text">{formError}</p>}
        </form>
      </div>

      {result && inputs && (
        <>
          <ResultCard result={result} />
          <JobRecordForm inputs={inputs} result={result} />
          <ShareCard inputs={inputs} result={result} />
        </>
      )}
    </>
  );
}
