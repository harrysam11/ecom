import { getSettings } from "@/lib/actions"
import Header from "@/components/shared/header"
import Footer from "@/components/shared/footer"

export default async function StorefrontLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: { domain: string }
}) {
    const { domain } = await params
    const settings = await getSettings(domain)

    return (
        <div className="flex min-h-screen flex-col">
            <Header siteName={settings?.siteName} />
            <main className="flex-1">{children}</main>
            <Footer siteName={settings?.siteName} />
        </div>
    )
}
