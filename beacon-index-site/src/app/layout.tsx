import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beacon Index | Psychosocial Safety Pulse & Insights",
  description:
    "The Beacon Index turns weekly employee feedback into psychosocial safety insights, helping organisations meet ISO 45003 obligations and support every team.",
  metadataBase: new URL("https://beaconindex.com.au"),
  openGraph: {
    title: "Beacon Index | Psychosocial Safety Pulse & Insights",
    description:
      "Mitigate psychosocial risk, improve wellbeing, and measure workplace experience in real time with the Beacon Index.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beacon Index | Psychosocial Safety Pulse & Insights",
    description:
      "A weekly psychosocial safety pulse that gives leaders the evidence needed to act decisively.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
