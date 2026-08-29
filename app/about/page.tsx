import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — hvacnumbers",
  description:
    "What hvacnumbers is and what it is not: a free, mobile-first field reference calculator for HVAC technicians.",
};

export default function AboutPage() {
  return (
    <main>
      <div className="card prose">
        <h1>About hvacnumbers</h1>
        <p>
          hvacnumbers is a free, mobile-first calculator built for HVAC technicians to
          run quick field numbers — starting with external static pressure (ESP) — and
          get an instant, plain-English read on the result, right from a job site. It is
          not a design tool, not a substitute for ACCA-approved design software or
          manufacturer procedures, and not a replacement for professional judgment. It
          is a fast reference for the numbers you already measure.
        </p>
      </div>
    </main>
  );
}
