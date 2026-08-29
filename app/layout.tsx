import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hvacnumbers.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Static Pressure Calculator for HVAC Technicians — hvacnumbers",
  description:
    "Free ESP calculator for HVAC techs. Enter your supply, return, filter, and coil readings — get your external static pressure instantly. No login. No install.",
  applicationName: "hvacnumbers",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Static Pressure Calculator for HVAC Technicians — hvacnumbers",
    description:
      "Free ESP calculator for HVAC techs. Enter your supply, return, filter, and coil readings — get your external static pressure instantly. No login. No install.",
    url: SITE_URL,
    siteName: "hvacnumbers",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Static Pressure Calculator for HVAC Technicians — hvacnumbers",
    description:
      "Free ESP calculator for HVAC techs. Enter your supply, return, filter, and coil readings — get your external static pressure instantly.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="site-header">
          <div className="site-header__inner">
            <Link href="/" className="site-header__brand">
              hvacnumbers
            </Link>
            <nav className="site-header__nav">
              <Link href="/about">About</Link>
              <Link href="/privacy">Privacy</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <p>
            hvacnumbers.com — a free field reference tool for HVAC technicians.{" "}
            <Link href="/about">About</Link> · <Link href="/privacy">Privacy</Link>
          </p>
        </footer>
        <GoogleAnalytics />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
