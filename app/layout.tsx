import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Princess Crown Diary",
  description: "A tiny princess crown app made with love for Nov 18.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
