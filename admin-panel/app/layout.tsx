import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

import { AdminNavbar } from "@/components/admin/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Platform Admin | Ecom SaaS",
    description: "Manage your SaaS platform",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AdminNavbar />
                <main>{children}</main>
                <Toaster position="top-center" />
            </body>
        </html>
    )
}

