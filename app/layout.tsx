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

export const metadata = {
  title: {
    default: "ECOM Store | Premium Ecommerce",
    template: "%s | ECOM Store"
  },
  description: "Experience premium shopping with ECOM. Curated collection of tech, fashion, and lifestyle products.",
  keywords: ["ecommerce", "shopping", "premium", "tech", "fashion"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ecom-store-demo.vercel.app", // Placeholder
    siteName: "ECOM Store",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ecomstore",
    creator: "@ecomstore",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-background font-sans antialiased ${inter.variable} ${playfair.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
