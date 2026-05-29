import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KINFORM Payload Studio",
  description:
    "In-browser IDE for KINFORM-AEO. Draft campaigns, run agentic simulations, gate every promotion behind human approval, then compile a self-contained Python bootstrapper.",
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
