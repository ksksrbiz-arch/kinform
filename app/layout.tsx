import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kinform.studio"),
  title: "KINFORM | Contemporary Women's Clothing",
  description: "Three original designs. Quiet connections. Explore the debut collection and generate professional tech packs for KINFORM — a new contemporary women's clothing line.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "KINFORM — Contemporary Women's Clothing",
    description: "A new language of dressing. TETHER, CLASP, APERTURE. Digital lookbook and atelier tools.",
    images: [{ url: "/images/hero/og.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#F8F4ED] text-[#2C2722] dark:bg-[#1A1816] dark:text-[#F1E9DF]">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <Header />
          <main className="flex-1 pt-20">{children}</main>
          <Footer />
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
