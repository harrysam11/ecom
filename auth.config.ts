import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login", // Default signIn page
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
            const isOnAdmin = nextUrl.pathname.startsWith("/admin")

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            }

            if (isOnAdmin) {
                if (isLoggedIn && auth?.user?.role === "ADMIN") return true
                return false
            }

            return true
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
                session.user.role = token.role as "ADMIN" | "USER"
            }
            return session
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
