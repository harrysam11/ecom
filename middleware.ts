import { auth } from "@/auth"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
    const session = await auth()
    const user = session?.user

    const url = request.nextUrl
    const hostnameWithPort = request.headers.get("host") || ""
    const hostname = hostnameWithPort.split(":")[0]

    // Define domains to exclude from subdomain routing
    const rootDomains = ["localhost", "ecom-saas.com"]

    let domain = ""
    if (hostname === "localhost" || hostname === "ecom-saas.com") {
        domain = "platform"
    } else if (hostname.endsWith(".localhost")) {
        domain = hostname.replace(".localhost", "")
    } else {
        domain = hostname.split(".")[0]
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
            const newPath = `/${domain}${path}${searchParams ? `?${searchParams}` : ""}`
            return NextResponse.rewrite(new URL(newPath, request.url))
        }
    }

    // API prefix handling
    if (path.startsWith("/api/auth")) {
        return NextResponse.next()
    }

    if (path.startsWith("/api")) {
        return NextResponse.next()
    }


    // Storefront routes: rewrite /xxx -> /[domain]/xxx
    const searchParams = url.searchParams.toString()

    // Special case for 'admin' subdomain on port 3000 - visit root goes to admin
    if (domain === "admin" && path === "/") {
        return NextResponse.rewrite(new URL(`/admin/admin`, request.url))
    }

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
