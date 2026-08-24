import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/lib/providers";
import { initAdmin } from "@/lib/initAdmin";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntelliPOS | Smart Point of Sale & Business Management",
  description:
    "IntelliPOS is an intelligent point-of-sale platform designed to streamline sales, inventory management, customer tracking, analytics, and business operations.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ensure default admin exists on first server render
  try {
    await initAdmin();
  } catch (err) {
    // don't break rendering on init failure
    console.error("initAdmin error:", err);
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}