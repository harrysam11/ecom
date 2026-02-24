import { type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request)
    const url = request.nextUrl
    const hostname = request.headers.get("host") || ""

    // Define domains to exclude from subdomain routing (e.g., your main marketing site)
    const rootDomains = ["localhost:3000", "ecom-saas.com"]

    let domain = ""
    if (rootDomains.includes(hostname)) {
        // If accessing the root domain, we might want to show a landing page
        // or default to a "main" store for now.
        domain = "main"
    } else {
        // Extract subdomain
        domain = hostname.split(".")[0]
    }

    const path = url.pathname

    // Rewriting logic
    if (path.startsWith("/admin")) {
        // Admin routes: rewrite /admin/xxx -> /(admin)/[domain]/admin/xxx
        // Note: app/(admin)/[domain]/admin is where we moved the admin-panel app
        const searchParams = url.searchParams.toString()
        const newPath = `/(admin)/${domain}${path}${searchParams ? `?${searchParams}` : ""}`

        // Basic Auth Check for Admin
        if (!user && !path.includes("/login")) {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }

        return NextResponse.rewrite(new URL(newPath, request.url))
    }

    // API prefix handling (if any global APIs exist)
    if (path.startsWith("/api")) {
        return supabaseResponse
    }

    // Storefront routes: rewrite /xxx -> /(storefront)/[domain]/xxx
    const searchParams = url.searchParams.toString()
    const newPath = `/(storefront)/${domain}${path}${searchParams ? `?${searchParams}` : ""}`

    return NextResponse.rewrite(new URL(newPath, request.url))
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
