"use client";

import { useEffect, useRef, useState } from "react";
import type { StaticPressureInputs, StaticPressureResult } from "@/lib/calculations";
import { trackEvent } from "@/components/GoogleAnalytics";

interface Props {
  inputs: StaticPressureInputs;
  result: StaticPressureResult;
}

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1920;

const STATUS_COLOR: Record<StaticPressureResult["status"], string> = {
  low: "#d97706",
  normal: "#22c55e",
  "high-normal": "#d97706",
  high: "#ef4444",
};

const STATUS_LABEL: Record<StaticPressureResult["status"], string> = {
  low: "BELOW TYPICAL RANGE",
  normal: "WITHIN TYPICAL RANGE",
  "high-normal": "HIGH END OF TYPICAL RANGE",
  high: "ABOVE TYPICAL RANGE",
};

const FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif";

function drawCard(
  canvas: HTMLCanvasElement,
  inputs: StaticPressureInputs,
  result: StaticPressureResult
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  // Background
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);

  // Brand
  ctx.fillStyle = "#94a3b8";
  ctx.font = `700 34px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.fillText("HVACNUMBERS.COM", CARD_WIDTH / 2, 160);

  ctx.fillStyle = "#e2e8f0";
  ctx.font = `600 40px ${FONT_STACK}`;
  ctx.fillText("Static Pressure (ESP)", CARD_WIDTH / 2, 240);

  // Result card
  const cardX = 90;
  const cardY = 340;
  const cardW = CARD_WIDTH - cardX * 2;
  const cardH = 760;
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, cardX, cardY, cardW, cardH, 32);
  ctx.fill();

  ctx.fillStyle = "#6b7280";
  ctx.font = `600 30px ${FONT_STACK}`;
  ctx.fillText("EXTERNAL STATIC PRESSURE", CARD_WIDTH / 2, cardY + 110);

  ctx.fillStyle = "#1e40af";
  ctx.font = `800 190px ${FONT_STACK}`;
  ctx.fillText(`${result.esp.toFixed(2)}"`, CARD_WIDTH / 2, cardY + 340);

  // Status pill
  const pillLabel = STATUS_LABEL[result.status];
  ctx.font = `700 30px ${FONT_STACK}`;
  const pillTextWidth = ctx.measureText(pillLabel).width;
  const pillPaddingX = 36;
  const pillW = pillTextWidth + pillPaddingX * 2;
  const pillH = 68;
  const pillX = CARD_WIDTH / 2 - pillW / 2;
  const pillY = cardY + 400;
  ctx.fillStyle = `${STATUS_COLOR[result.status]}22`;
  roundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
  ctx.fill();
  ctx.fillStyle = STATUS_COLOR[result.status];
  ctx.fillText(pillLabel, CARD_WIDTH / 2, pillY + pillH / 2 + 11);

  // Divider
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cardX + 60, pillY + pillH + 60);
  ctx.lineTo(cardX + cardW - 60, pillY + pillH + 60);
  ctx.stroke();

  // Inputs list
  const rows: [string, string][] = [
    ["Supply static", `${inputs.supplyStatic.toFixed(2)}"`],
    ["Return static", `${inputs.returnStatic.toFixed(2)}"`],
    ["Filter drop", `${inputs.filterDrop.toFixed(2)}"`],
    ["Coil drop", `${inputs.coilDrop.toFixed(2)}"`],
  ];
  let rowY = pillY + pillH + 130;
  ctx.textAlign = "left";
  for (const [label, value] of rows) {
    ctx.fillStyle = "#6b7280";
    ctx.font = `500 34px ${FONT_STACK}`;
    ctx.fillText(label, cardX + 60, rowY);
    ctx.fillStyle = "#111827";
    ctx.font = `700 34px ${FONT_STACK}`;
    ctx.textAlign = "right";
    ctx.fillText(value, cardX + cardW - 60, rowY);
    ctx.textAlign = "left";
    rowY += 66;
  }

  // Footer
  ctx.textAlign = "center";
  ctx.fillStyle = "#64748b";
  ctx.font = `500 28px ${FONT_STACK}`;
  ctx.fillText(
    "Free field calculator for HVAC technicians",
    CARD_WIDTH / 2,
    cardY + cardH + 90
  );
  ctx.fillStyle = "#e2e8f0";
  ctx.font = `700 36px ${FONT_STACK}`;
  ctx.fillText("hvacnumbers.com", CARD_WIDTH / 2, cardY + cardH + 150);
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export default function ShareCard({ inputs, result }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canShareFiles, setCanShareFiles] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) drawCard(canvas, inputs, result);
  }, [inputs, result]);

  useEffect(() => {
    const nav = navigator as Navigator & {
      canShare?: (data?: ShareData) => boolean;
    };
    if (typeof nav.canShare === "function") {
      try {
        const testFile = new File([], "test.png", { type: "image/png" });
        setCanShareFiles(nav.canShare({ files: [testFile] }));
      } catch {
        setCanShareFiles(false);
      }
    }
  }, []);

  async function getBlob(): Promise<Blob | null> {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
  }

  async function handleShare() {
    const blob = await getBlob();
    if (!blob) return;
    const file = new File([blob], "hvacnumbers-esp-result.png", { type: "image/png" });
    try {
      await navigator.share({
        files: [file],
        title: "hvacnumbers — Static Pressure result",
        text: `My external static pressure is ${result.esp.toFixed(2)}" — hvacnumbers.com`,
      });
      trackEvent("share_card_shared");
    } catch {
      // User cancelled the share sheet — no action needed.
    }
  }

  async function handleDownload() {
    const blob = await getBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hvacnumbers-esp-result.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    trackEvent("share_card_downloaded");
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText("https://hvacnumbers.com");
      setCopied(true);
      trackEvent("share_card_link_copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — ignore.
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">Share this result</h2>
      <canvas
        ref={canvasRef}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        className="share-preview"
        aria-label="Shareable result card preview"
      />
      <div className="button-row">
        {canShareFiles ? (
          <button className="btn" onClick={handleShare} type="button">
            Share
          </button>
        ) : (
          <button className="btn" onClick={handleDownload} type="button">
            Download
          </button>
        )}
        <button className="btn btn--secondary" onClick={handleCopyLink} type="button">
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
