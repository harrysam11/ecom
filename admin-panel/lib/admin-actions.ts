"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    stock: z.number().int().min(0, "Stock must be positive"),
    lowStockThreshold: z.number().int().min(0).default(10),
    categoryId: z.string().min(1, "Category is required"),
    images: z.array(z.string()).default([]),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    variants: z.array(z.object({
        name: z.string(),
        price: z.number().optional(),
        stock: z.number().int().default(0),
    })).optional(),
})

export async function createProduct(data: z.infer<typeof productSchema>) {
    try {
        const product = await prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                price: data.price,
                stock: data.stock,
                lowStockThreshold: data.lowStockThreshold,
                categoryId: data.categoryId,
                images: data.images,
                status: data.status,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                variants: {
                    create: data.variants || []
                }
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
        // Delete old variants and create new ones for simplicity in this demo
        await prisma.productVariant.deleteMany({ where: { productId: id } })

        const product = await prisma.product.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                price: data.price,
                stock: data.stock,
                lowStockThreshold: data.lowStockThreshold,
                categoryId: data.categoryId,
                images: data.images,
                status: data.status,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                variants: {
                    create: data.variants || []
                }
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
        await prisma.product.delete({ where: { id } })
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
        const category = await prisma.category.create({
            data: {
                name: data.name,
                slug: data.slug,
                parentId: data.parentId || null,
                image: data.image,
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
        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                slug: data.slug,
                parentId: data.parentId || null,
                image: data.image,
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
        await prisma.category.delete({ where: { id } })
        revalidatePath("/categories")
        revalidateTag("categories")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateOrderStatus(id: string, status: any) {
    try {
        const order = await prisma.order.update({
            where: { id },
            data: { status },
            include: { user: true }
        })

        if (["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].includes(status)) {
            const { EmailService } = await import("./email-service")
            await EmailService.sendShippingEmail(order)
        }

        // Add Audit Log
        await prisma.auditLog.create({
            data: {
                userId: "admin-id", // Should get from session
                action: "ORDER_STATUS_CHANGE",
                entity: "Order",
                entityId: id,
                details: { status }
            }
        })

        revalidatePath("/orders")
        revalidatePath(`/orders/${id}`)
        return { success: true, order }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateOrderTracking(id: string, trackingNumber: string, courierName?: string) {
    try {
        const order = await prisma.order.update({
            where: { id },
            data: {
                trackingNumber,
                courierName,
                shippedAt: new Date()
            }
        })
        revalidatePath("/orders")
        revalidatePath(`/orders/${id}`)
        return { success: true, order }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}


const couponSchema = z.object({
    code: z.string().min(1, "Code is required"),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.number().min(0),
    minCartValue: z.number().optional().nullable(),
    usageLimit: z.number().int().optional().nullable(),
    expiresAt: z.date(),
    isActive: z.boolean().default(true),
})

export async function createCoupon(data: any) {
    try {
        const coupon = await prisma.coupon.create({
            data: {
                ...data,
                expiresAt: new Date(data.expiresAt)
            }
        })
        revalidatePath("/coupons")
        return { success: true, coupon }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateCoupon(id: string, data: any) {
    try {
        const coupon = await prisma.coupon.update({
            where: { id },
            data: {
                ...data,
                expiresAt: new Date(data.expiresAt)
            }
        })
        revalidatePath("/coupons")
        return { success: true, coupon }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteCoupon(id: string) {
    try {
        await prisma.coupon.delete({ where: { id } })
        revalidatePath("/coupons")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

// Shipping Actions
export async function createShippingZone(data: { name: string, countries: string[], states: string[] }) {
    try {
        const zone = await prisma.shippingZone.create({ data })
        revalidatePath("/settings/shipping")
        return { success: true, zone }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteShippingZone(id: string) {
    try {
        await prisma.shippingZone.delete({ where: { id } })
        revalidatePath("/settings/shipping")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function createShippingRate(data: { zoneId: string, minWeight: number, maxWeight?: number | null, flatPrice: number, estimatedDays?: string }) {
    try {
        const rate = await prisma.shippingRate.create({
            data: {
                ...data,
                maxWeight: data.maxWeight || null
            }
        })
        revalidatePath("/settings/shipping")
        return { success: true, rate }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function deleteShippingRate(id: string) {
    try {
        await prisma.shippingRate.delete({ where: { id } })
        revalidatePath("/settings/shipping")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateCODSettings(enabled: boolean) {
    try {
        await prisma.settings.upsert({
            where: { id: "site-settings" },
            update: { isCODEnabled: enabled },
            create: { id: "site-settings", isCODEnabled: enabled }
        })
        revalidatePath("/settings/shipping")
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function getSettings() {
    try {
        const settings = await prisma.settings.findUnique({
            where: { id: "site-settings" }
        })
        return settings || {
            siteName: "Antigravity E-com",
            companyName: "Antigravity E-com",
            address: "123 E-commerce Street, Tech City, TC 10101",
            email: "support@antigravity.ecom",
            phone: "+1 234 567 890",
            currency: "USD",
            taxPercentage: 0
        }
    } catch (error) {
        console.error("Failed to get settings:", error)
        return null
    }
}

export async function updateSettings(data: any) {
    try {
        const settings = await prisma.settings.upsert({
            where: { id: "site-settings" },
            update: {
                ...data,
                taxPercentage: Number(data.taxPercentage)
            },
            create: {
                id: "site-settings",
                ...data,
                taxPercentage: Number(data.taxPercentage)
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




