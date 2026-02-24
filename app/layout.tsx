import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import { Toaster } from "@/components/ui/sonner"
import { Providers } from "@/components/providers"
import { getSettings } from "@/lib/actions"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const siteName = settings?.siteName || "ECOM Store"

  return {
    title: {
      default: `${siteName} | Premium Ecommerce`,
      template: `%s | ${siteName}`
    },
    description: settings?.metaDescription || "Experience premium shopping. Curated collection of tech, fashion, and lifestyle products.",
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: siteName,
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSettings()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.variable} ${playfair.variable}`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header siteName={settings?.siteName} />
            <main className="flex-1">{children}</main>
            <Footer siteName={settings?.siteName} />
          </div>
        </Providers>
      </body>
    </html>
  )
}
