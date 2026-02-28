import { getSettings } from "@/lib/actions"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"
import Chatbot from "@/components/shared/chatbot"

export default async function StorefrontLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { domain: string }
}) {
    const { domain } = await params
    const settings = await getSettings(domain)

    const isPlatform = domain === "platform"

    const themeStyles = {
        "--primary": settings?.themeColor || "#000000",
        "--font-store": settings?.fontFamily === "playfair" ? "var(--font-serif)" :
            settings?.fontFamily === "poppins" ? "var(--font-poppins)" :
                settings?.fontFamily === "roboto" ? "var(--font-roboto)" :
                    "var(--font-sans)"
    } as React.CSSProperties

    return (
        <div
            className="flex min-h-screen flex-col font-store"
            style={themeStyles}
        >
            {!isPlatform && <Header siteName={settings?.siteName} />}
            <main className="flex-1">{children}</main>
            {!isPlatform && <Footer siteName={settings?.siteName} showBranding={settings?.store?.plan === "FREE"} />}
            {!isPlatform && settings?.store?.plan === "PREMIUM" && (
                <Chatbot storeName={settings?.siteName || "Store"} />
            )}
        </div>
    )
}
