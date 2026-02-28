import type { Metadata } from "next";
import { Inter, Playfair_Display, Poppins, Roboto } from "next/font/google";
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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

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
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.variable} ${playfair.variable} ${poppins.variable} ${roboto.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
