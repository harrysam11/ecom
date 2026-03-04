"use server"

import { signIn, signOut, auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isRedirectError } from "next/dist/client/components/redirect-error"

export async function login(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        })
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return { error: "Invalid credentials." }
    }

    revalidatePath("/", "layout")
    return { success: true }
}

export async function signup(formData: FormData) {
    // For testing/Prisma, we'd need a custom signup logic that creates a user in Prisma
    // Since the user just wants to test with seeded credentials, let's keep it simple
    return { error: "Signup is currently disabled for testing. Use seeded credentials." }
}

export async function logout() {
    await signOut({ redirectTo: "/login" })
}

export async function loginWithGoogle() {
    try {
        await signIn("google")
    } catch (error) {
        if (isRedirectError(error)) {
            throw error
        }
        return { error: "Google login failed." }
    }
}
export async function getUser() {
    const session = await auth()
    return session?.user
}
