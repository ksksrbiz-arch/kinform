import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "next-themes";
// import { Analytics } from "@vercel/analytics/next";  // Temporarily commented for build stability

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F4ED" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1816" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kinform.studio"),
  title: {
    default: "KINFORM | Contemporary Women's Clothing",
    template: "%s | KINFORM",
  },
  description:
    "Three original designs. Quiet connections. Explore the debut collection and generate professional tech packs for KINFORM — a new contemporary women's clothing line.",
  keywords: [
    "women's clothing",
    "contemporary fashion",
    "sustainable clothing",
    "TETHER",
    "CLASP",
    "APERTURE",
    "debut collection 2026",
    "made to order",
    "tech pack",
  ],
  authors: [{ name: "KINFORM Studio", url: "https://kinform.studio" }],
  creator: "KINFORM",
  publisher: "KINFORM",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kinform.studio",
    siteName: "KINFORM",
    title: "KINFORM — Contemporary Women's Clothing",
    description:
      "A new language of dressing. TETHER, CLASP, APERTURE. Digital lookbook and atelier tools.",
    images: [
      {
        url: "/images/hero/og.jpg",
        width: 1200,
        height: 630,
        alt: "KINFORM Debut Collection 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KINFORM — Contemporary Women's Clothing",
    description:
      "Three original designs. Made to order. Debut collection 2026.",
    images: ["/images/hero/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
