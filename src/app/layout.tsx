import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import Script from "next/script";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { QuoteProvider } from "@/components/quote/QuoteProvider";
import { JsonLd, storeJsonLd } from "@/components/seo/JsonLd";
import { siteConfig } from "@/config/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.legalName} | Bodrum Mumcular Showroom`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["seramik", "vitrifiye", "Bodrum seramik", "Mumcular", "banyo", "porselen karo", "toptan seramik", "havuz karosu"],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.legalName,
    images: [{ url: "/brand/seravit-logo.png", width: 1400, height: 775, alt: siteConfig.legalName }],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#fcfbfc",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${bodoni.variable} ${jost.variable}`} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        {/* Açılış animasyonu oturumda bir kez: tekrar ziyarette boyamadan önce gizle */}
        <Script id="intro-seen" strategy="beforeInteractive">
          {`try{if(sessionStorage.getItem("seravit:intro"))document.documentElement.dataset.intro="seen"}catch(e){}`}
        </Script>
        <a href="#icerik" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2">
          İçeriğe geç
        </a>
        <QuoteProvider>
          <Header />
          <main id="icerik" className="flex-1">
            {children}
          </main>
          <Footer />
          <FloatingActions />
        </QuoteProvider>
        <JsonLd data={storeJsonLd()} />
      </body>
    </html>
  );
}
