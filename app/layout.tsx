import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scout — AI Website Data Extractor",
  description:
    "Turn public website pages into clean, structured data with a little help from AI.",
  applicationName: "Scout",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}