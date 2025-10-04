import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meet - Video Conferencing",
  description: "Wasm-powered video conferencing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
