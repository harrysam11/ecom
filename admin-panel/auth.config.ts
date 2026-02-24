import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login", // Default signIn page
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const userRole = auth?.user?.role

            const isLoginPage = nextUrl.pathname.startsWith("/login")
            const isPublicPage = isLoginPage // Add more if needed

            if (isPublicPage) return true

            if (!isLoggedIn) return false // Redirect to login

            // Only ADMIN and STAFF can access admin panel
            if (userRole === "ADMIN" || userRole === "STAFF") {
                return true
            }

            return false // Deny access for USER/CUSTOMER roles
        },
        jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            if (trigger === "update" && session) {
                token = { ...token, ...session }
            }
            return token
        },
        session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.role = token.role as "ADMIN" | "STAFF" | "USER" | "CUSTOMER"
            }
            return session
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
