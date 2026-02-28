import { type NextRequest } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"
import { NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request)
    const url = request.nextUrl
    const hostnameWithPort = request.headers.get("host") || ""
    const hostname = hostnameWithPort.split(":")[0]

    // Define domains to exclude from subdomain routing (e.g., your main marketing site)
    const rootDomains = ["localhost", "ecom-saas.com"]

    let domain = ""
    if (rootDomains.includes(hostname)) {
        // If accessing the root domain, we show the platform landing page
        domain = "platform"
    } else {
        // Extract subdomain
        domain = hostnameWithPort.split(".")[0]
    }

    const path = url.pathname

    // Rewriting logic
    if (path.startsWith("/admin") || path.startsWith("/setup")) {
        // Admin or Setup routes: basic Auth Check
        if (!user && !path.includes("/login")) {
            return NextResponse.redirect(new URL("/admin/login", request.url))
        }

        if (path.startsWith("/admin")) {
            const searchParams = url.searchParams.toString()
            // Next.js rewrites match logical paths, not folder structure (route groups are omitted)
            const newPath = `/${domain}${path}${searchParams ? `?${searchParams}` : ""}`
            return NextResponse.rewrite(new URL(newPath, request.url))
        }
    }

    // API prefix handling (if any global APIs exist)
    if (path.startsWith("/api")) {
        return supabaseResponse
    }

    // Storefront routes: rewrite /xxx -> /[domain]/xxx
    const searchParams = url.searchParams.toString()
    const newPath = `/${domain}${path === "/" ? "" : path}${searchParams ? `?${searchParams}` : ""}`

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
