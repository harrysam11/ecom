"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { getStoreOrThrow } from "./store"
import { PRICING_PLANS } from "@/lib/pricing"

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    stock: z.number().int().min(0, "Stock must be positive"),
    categoryId: z.string().min(1, "Category is required"),
    images: z.array(z.string()).default([]),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
})

export async function createProduct(data: z.infer<typeof productSchema>) {
    try {
        const store = await getStoreOrThrow()

        // Enforce Product Limits based on Pricing Tier
        const productCount = await prisma.product.count({
            where: { storeId: store.id }
        })
        const limit = PRICING_PLANS[store.plan as keyof typeof PRICING_PLANS]?.productsLimit || 10
        if (productCount >= limit) {
            return { success: false, error: `You have reached the maximum product limit (${limit}) for your ${store.plan} plan. Please upgrade to add more.` }
        }

        const product = await prisma.product.create({
            data: {
                ...data,
                storeId: store.id,
            }
        })

        revalidatePath("/products")
        revalidateTag("products")
        return { success: true, product }
    } catch (error: any) {
        console.error("Failed to create product:", error)
        return { success: false, error: error.message }
    }
}

export async function updateProduct(id: string, data: z.infer<typeof productSchema>) {
    try {
        const store = await getStoreOrThrow()
        const product = await prisma.product.update({
            where: { id, storeId: store.id },
            data: {
                ...data,
            }
        })

        revalidatePath("/products")
        revalidateTag("products")
        return { success: true, product }
    } catch (error: any) {
        console.error("Failed to update product:", error)
        return { success: false, error: error.message }
    }
}

export async function deleteProduct(id: string) {
    try {
        const store = await getStoreOrThrow()
        await prisma.product.delete({
            where: { id, storeId: store.id }
        })
        revalidatePath("/products")
        revalidateTag("products")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    parentId: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
})

export async function createCategory(data: z.infer<typeof categorySchema>) {
    try {
        const store = await getStoreOrThrow()
        const category = await prisma.category.create({
            data: {
                ...data,
                storeId: store.id,
                parentId: data.parentId || null,
            }
        })
        revalidatePath("/categories")
        revalidateTag("categories")
        return { success: true, category }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateCategory(id: string, data: z.infer<typeof categorySchema>) {
    try {
        const store = await getStoreOrThrow()
        const category = await prisma.category.update({
            where: { id, storeId: store.id },
            data: {
                ...data,
                parentId: data.parentId || null,
            }
        })
        revalidatePath("/categories")
        revalidateTag("categories")
        return { success: true, category }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteCategory(id: string) {
    try {
        const store = await getStoreOrThrow()
        await prisma.category.delete({
            where: { id, storeId: store.id }
        })
        revalidatePath("/categories")
        revalidateTag("categories")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getCategories() {
    try {
        const store = await getStoreOrThrow()
        const categories = await prisma.category.findMany({
            where: { storeId: store.id },
            select: { id: true, name: true }
        })
        return categories
    } catch (error) {
        console.error("Failed to get categories:", error)
        return []
    }
}

export async function updateOrderStatus(id: string, status: any) {
    try {
        const store = await getStoreOrThrow()
        const order = await prisma.order.update({
            where: { id, storeId: store.id },
            data: { status },
        })

        revalidatePath("/orders")
        revalidatePath(`/orders/${id}`)
        return { success: true, order }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getSettings() {
    try {
        const store = await getStoreOrThrow()
        return {
            ...store.siteSettings,
            morMerchantId: store.morMerchantId,
            morWebhookKey: store.morWebhookKey
        }
    } catch (error) {
        console.error("Failed to get settings:", error)
        return null
    }
}

export async function updateSettings(data: any) {
    try {
        const store = await getStoreOrThrow()

        const { morMerchantId, morWebhookKey, ...settingsData } = data

        await prisma.store.update({
            where: { id: store.id },
            data: {
                morMerchantId: morMerchantId || null,
                morWebhookKey: morWebhookKey || null,
            }
        })

        const settings = await prisma.settings.upsert({
            where: { storeId: store.id },
            update: {
                ...settingsData
            },
            create: {
                storeId: store.id,
                ...settingsData
            }
        })
        revalidatePath("/(admin)", "layout")
        revalidatePath("/")
        return { success: true, settings }
    } catch (error: any) {
        console.error("Failed to update settings:", error)
        return { success: false, error: error.message }
    }
}
