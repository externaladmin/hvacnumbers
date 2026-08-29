import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "hvacnumbers — HVAC Field Calculator",
    short_name: "hvacnumbers",
    description:
      "Free, mobile-first field calculators for HVAC technicians. Starting with static pressure (ESP).",
    start_url: "/",
    display: "standalone",
    background_color: "#f3f4f6",
    theme_color: "#0f172a",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
