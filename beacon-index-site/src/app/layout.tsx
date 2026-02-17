import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beacon Index | Psychosocial Risk Governance",
  description:
    "Beacon Index provides structured, system-level visibility of psychosocial risk — enabling early detection, defensible oversight, and proportionate action. Aligned to ISO 45003 principles.",
  metadataBase: new URL("https://beaconindex.com.au"),
  openGraph: {
    title: "Beacon Index | Psychosocial Risk Governance",
    description:
      "Structured, system-level visibility of psychosocial risk for governance oversight. Aligned to ISO 45003 principles.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beacon Index | Psychosocial Risk Governance",
    description:
      "Structured data. Early signals. Defensible governance insight.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
