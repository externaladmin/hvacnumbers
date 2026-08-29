import type { StaticPressureResult } from "@/lib/calculations";

const STATUS_LABEL: Record<StaticPressureResult["status"], string> = {
  low: "Below typical range",
  normal: "Within typical range",
  "high-normal": "High end of typical range",
  high: "Above typical range",
};

export default function ResultCard({ result }: { result: StaticPressureResult }) {
  return (
    <div className="card">
      <div className="result">
        <div className="result__label">External Static Pressure (ESP)</div>
        <div className="result__value">{result.esp.toFixed(2)}&Prime;</div>
        <span className={`badge badge--${result.status}`}>
          {STATUS_LABEL[result.status]}
        </span>
      </div>
      <p className="interpretation">{result.interpretation}</p>

      <dl className="formula-box">
        <dt>Formula</dt>
        <dd>
          <code>ESP = supply static + return static − filter drop − coil drop</code>
        </dd>
        <dt>Source</dt>
        <dd>ASHRAE / ACCA Manual D field reference guidance</dd>
        <dt>Typical range</dt>
        <dd>0.10&Prime; – 0.80&Prime; w.c. for most residential and light commercial systems</dd>
        <dt>Assumptions &amp; limits</dt>
        <dd>
          Assumes readings are taken at the correct locations with a properly zeroed
          manometer, and that supply/return values are entered as positive magnitudes.
          Actual normal ranges vary by equipment, duct design, and manufacturer
          specification — always check the equipment's rated external static pressure
          when one is available.
        </dd>
      </dl>

      <p className="disclaimer">
        This is a field reference tool. It is not a substitute for ACCA-approved design
        software, manufacturer procedures, or professional judgment.
      </p>
    </div>
  );
}
