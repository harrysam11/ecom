"use server"

import { prisma } from "@/lib/prisma"
import { getUser } from "@/lib/auth-actions"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { stripe } from "@/lib/stripe"

export async function createStore(formData: FormData) {
    const user = await getUser()
    if (!user) throw new Error("Unauthorized")

    const name = formData.get("name") as string
    const subdomain = formData.get("subdomain") as string
    let plan = formData.get("plan") as any || "FREE"
    const sessionId = formData.get("sessionId") as string

    if (!name || !subdomain) {
        return { error: "Name and subdomain are required" }
    }

    if (sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId)
            if (session.payment_status === "paid" || session.status === "complete") {
                plan = "PRO" // Default to PRO if they have a valid session
            } else {
                return { error: "Payment not completed" }
            }
        } catch (error) {
            console.error("Invalid session ID", error)
            return { error: "Invalid payment session" }
        }
    }

    try {
        const existingStore = await prisma.store.findUnique({
            where: { subdomain }
        })

        if (existingStore) {
            return { error: "Subdomain already taken" }
        }

        const store = await prisma.store.create({
            data: {
                name,
                subdomain,
                plan,
                storeUsers: {
                    create: {
                        userId: user.id,
                        role: "STORE_OWNER"
                    }
                },
                siteSettings: {
                    create: {
                        siteName: name
                    }
                }
            }
        })

        revalidatePath("/", "layout")
        return { success: true, storeId: store.id, subdomain: store.subdomain }
    } catch (error: any) {
        console.error("[CREATE_STORE_ERROR]", error)
        return { error: "Failed to create store" }
    }
}

export async function updateSettings(storeId: string, data: {
    siteName?: string
    footerText?: string
    themeColor?: string
    fontFamily?: string
    showNewsletter?: boolean
}) {
    const user = await getUser()
    if (!user) throw new Error("Unauthorized")

    try {
        const storeUser = await prisma.storeUser.findUnique({
            where: {
                userId_storeId: {
                    userId: user.id,
                    storeId: storeId
                }
            }
        })

        if (!storeUser || (storeUser.role !== "STORE_OWNER" && storeUser.role !== "SUPER_ADMIN")) {
            return { error: "Insufficient permissions" }
        }

        await prisma.settings.update({
            where: { storeId },
            data: data
        })

        revalidatePath("/", "layout")
        return { success: true }
    } catch (error: any) {
        console.error("[UPDATE_SETTINGS_ERROR]", error)
        return { error: "Failed to update settings" }
    }
}
