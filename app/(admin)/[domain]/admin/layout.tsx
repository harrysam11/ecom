import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
    title: "Admin Panel | E-com",
    description: "Enterprise E-commerce Administration",
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className={poppins.className}>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <AdminSidebar />
                <div className="flex flex-col">
                    <AdminHeader />
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/10">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
