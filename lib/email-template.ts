export interface JobRecordEmailData {
  name?: string;
  siteAddress?: string;
  supplyStatic: number;
  returnStatic: number;
  filterDrop: number;
  coilDrop: number;
  espResult: number;
  resultInterpretation: string;
  createdAt: string;
}

function fmt(n: number): string {
  return `${n.toFixed(2)}" w.c.`;
}

export function renderJobRecordEmail(data: JobRecordEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const dateLabel = new Date(data.createdAt).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const subject = `Your ESP job record — ${fmt(data.espResult)} — ${dateLabel}`;

  const greeting = data.name ? `Hi ${data.name},` : "Hi,";

  const html = `
  <div style="font-family: Inter, -apple-system, Segoe UI, Roboto, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #111827;">
    <div style="background:#0f172a; padding:20px 24px; border-radius:8px 8px 0 0;">
      <span style="color:#fff; font-weight:700; font-size:18px; letter-spacing:-0.02em;">hvacnumbers</span>
    </div>
    <div style="border:1px solid #e5e7eb; border-top:none; border-radius:0 0 8px 8px; padding:24px;">
      <p style="margin-top:0;">${greeting}</p>
      <p>Here's the job record you saved on ${dateLabel}.</p>

      <div style="background:#f3f4f6; border-radius:8px; padding:16px 20px; margin:20px 0;">
        <div style="font-size:13px; color:#6b7280; text-transform:uppercase; letter-spacing:0.05em;">External Static Pressure (ESP)</div>
        <div style="font-size:32px; font-weight:700; color:#1E40AF; margin-top:4px;">${fmt(
          data.espResult
        )}</div>
      </div>

      <p>${data.resultInterpretation}</p>

      ${
        data.siteAddress
          ? `<p><strong>Site:</strong> ${data.siteAddress}</p>`
          : ""
      }

      <table style="width:100%; border-collapse:collapse; margin-top:16px; font-size:14px;">
        <tbody>
          <tr>
            <td style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#6b7280;">Supply static</td>
            <td style="padding:8px 0; border-bottom:1px solid #e5e7eb; text-align:right;">${fmt(
              data.supplyStatic
            )}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#6b7280;">Return static</td>
            <td style="padding:8px 0; border-bottom:1px solid #e5e7eb; text-align:right;">${fmt(
              data.returnStatic
            )}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; border-bottom:1px solid #e5e7eb; color:#6b7280;">Filter drop</td>
            <td style="padding:8px 0; border-bottom:1px solid #e5e7eb; text-align:right;">${fmt(
              data.filterDrop
            )}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#6b7280;">Coil drop</td>
            <td style="padding:8px 0; text-align:right;">${fmt(data.coilDrop)}</td>
          </tr>
        </tbody>
      </table>

      <p style="font-size:12px; color:#9ca3af; margin-top:24px;">
        Formula: ESP = supply static + return static − filter drop − coil drop.
        This is a field reference tool. It is not a substitute for ACCA-approved
        design software, manufacturer procedures, or professional judgment.
      </p>
      <p style="font-size:12px; color:#9ca3af;">hvacnumbers.com</p>
    </div>
  </div>`;

  const text = `${greeting}

Here's the job record you saved on ${dateLabel}.

External Static Pressure (ESP): ${fmt(data.espResult)}

${data.resultInterpretation}

${data.siteAddress ? `Site: ${data.siteAddress}\n` : ""}Supply static: ${fmt(
    data.supplyStatic
  )}
Return static: ${fmt(data.returnStatic)}
Filter drop: ${fmt(data.filterDrop)}
Coil drop: ${fmt(data.coilDrop)}

Formula: ESP = supply static + return static − filter drop − coil drop.
This is a field reference tool. It is not a substitute for ACCA-approved
design software, manufacturer procedures, or professional judgment.

hvacnumbers.com`;

  return { subject, html, text };
}
