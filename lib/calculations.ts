export interface StaticPressureInputs {
  supplyStatic: number;
  returnStatic: number;
  filterDrop: number;
  coilDrop: number;
}

export type EspRangeStatus = "low" | "normal" | "high-normal" | "high";

export interface StaticPressureResult {
  esp: number;
  status: EspRangeStatus;
  inRange: boolean;
  interpretation: string;
}

// Typical field-normal ESP window, in inches of water column.
export const ESP_NORMAL_MIN = 0.1;
export const ESP_NORMAL_MAX = 0.8;
// Above this, most residential/light-commercial systems show real airflow
// restriction symptoms (reduced capacity, freeze-up risk, motor stress).
const ESP_HIGH_NORMAL_CEILING = 0.5;

export function calculateEsp(inputs: StaticPressureInputs): number {
  const { supplyStatic, returnStatic, filterDrop, coilDrop } = inputs;
  const esp = supplyStatic + returnStatic - filterDrop - coilDrop;
  // Avoid floating point noise like 0.30000000000000004 in the UI.
  return Math.round(esp * 1000) / 1000;
}

export function interpretEsp(esp: number): {
  status: EspRangeStatus;
  inRange: boolean;
  interpretation: string;
} {
  const inRange = esp >= ESP_NORMAL_MIN && esp <= ESP_NORMAL_MAX;

  if (esp < ESP_NORMAL_MIN) {
    return {
      status: "low",
      inRange,
      interpretation:
        "This reading is lower than the typical field range. Low ESP can mean oversized " +
        "ductwork, a disconnected or leaking supply/return connection, a damper left wide " +
        "open, or a bad reading — double-check your gauge placement and tubing before " +
        "acting on this number.",
    };
  }

  if (esp <= ESP_HIGH_NORMAL_CEILING) {
    return {
      status: "normal",
      inRange,
      interpretation:
        "This reading falls in the typical field range for most residential and light " +
        "commercial systems. Airflow across the coil and blower is likely close to design " +
        "conditions.",
    };
  }

  if (esp <= ESP_NORMAL_MAX) {
    return {
      status: "high-normal",
      inRange,
      interpretation:
        "This reading is on the higher end of the typical range. It's not necessarily a " +
        "problem, but it's worth checking filter condition, duct sizing, and any closed " +
        "dampers or crushed flex before calling it done.",
    };
  }

  return {
    status: "high",
    inRange,
    interpretation:
      "This reading is above the typical field range. High ESP usually points to airflow " +
      "restriction — a dirty filter, undersized or crushed ductwork, closed dampers, or a " +
      "dirty coil. Left uncorrected, this can reduce capacity and efficiency, stress the " +
      "blower motor, and increase the risk of coil freeze-up.",
  };
}

export function calculateStaticPressure(
  inputs: StaticPressureInputs
): StaticPressureResult {
  const esp = calculateEsp(inputs);
  const { status, inRange, interpretation } = interpretEsp(esp);
  return { esp, status, inRange, interpretation };
}
