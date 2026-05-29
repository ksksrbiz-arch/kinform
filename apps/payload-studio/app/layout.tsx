import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KINFORM Payload Studio",
  description:
    "Visual IDE + Polymorphic Bootstrapping Compiler for the KINFORM Autonomous Ecosystem Orchestrator.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-kinform-ink text-kinform-parchment">
        <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-kinform-torque font-mono text-xs">KINFORM-AEO</span>
            <h1 className="text-lg font-semibold tracking-wide">Payload Studio</h1>
          </div>
          <span className="text-xs text-white/40 font-mono">
            Torqued Affiliation™ · Visual IDE
          </span>
        </header>
        {children}
      </body>
    </html>
  );
}
