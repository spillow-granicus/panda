import type { Metadata } from "next";
import { Newsreader, Source_Sans_3 } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Solution design",
  description: "Build a customer solution design from Salesforce and call transcripts.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${sans.variable} ${display.variable} ${sans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
