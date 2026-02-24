"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { headers } from "next/headers"
import { getUser } from "@/lib/auth-actions"

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    price: z.coerce.number().positive("Price must be positive"),
    stock: z.coerce.number().int().nonnegative("Stock must be non-negative"),
    categoryId: z.string().min(1, "Category is required"),
    images: z.array(z.string()).optional().default([]),
})

export async function createProduct(formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        categoryId: formData.get("categoryId"),
        images: formData.getAll("images") as string[],
    }

    const validated = productSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors }
    }

    try {
        const hostname = (await headers()).get("host") || ""
        const subdomain = hostname.split(".")[0]
        const store = await prisma.store.findUnique({
            where: { subdomain }
        })

        if (!store) return { error: "Store not found" }

        await prisma.product.create({
            data: {
                ...validated.data,
                storeId: store.id,
                price: validated.data.price,
                stock: validated.data.stock,
                slug: validated.data.name.toLowerCase().replace(/ /g, "-"),
            },
        })

        revalidatePath("/admin/products")
        revalidatePath("/")
        // @ts-ignore
        revalidateTag("products")
        return { success: true }
    } catch (error) {
        console.error("Failed to create product:", error)
        return { error: "Failed to create product" }
    }
}

export async function deleteProduct(id: string) {
    try {
        await prisma.product.delete({
            where: { id },
        })

        revalidatePath("/admin/products")
        revalidatePath("/")
        // @ts-ignore
        revalidateTag("products")
        return { success: true }
    } catch (error) {
        console.error("Failed to delete product:", error)
        return { error: "Failed to delete product" }
    }
}

export async function getCategories() {
    const hostname = (await headers()).get("host") || ""
    const subdomain = hostname.split(".")[0]
    return await prisma.category.findMany({
        where: { store: { subdomain } },
        orderBy: { name: "asc" },
    })
}

export async function createOrder(data: {
    items: { productId: string; quantity: number; price: number }[]
    total: number
    shippingAddress: {
        firstName: string
        lastName: string
        email: string
        address: string
        city: string
        postalCode: string
    }
}) {
    const user = await getUser()
    if (!user?.id) {
        return { error: "You must be logged in to place an order" }
    }

    try {
        // 1. Start a transaction
        const result = await prisma.$transaction(async (tx) => {
            // 2. Check stock and reduce it
            for (const item of data.items) {
                const product = await tx.product.findUnique({
                    where: { id: item.productId }
                })

                if (!product || product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${product?.name || 'product'}`)
                }

                await tx.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                })
            }

            // 3. Create Address (or find existing, simplifying for now)
            const address = await tx.address.create({
                data: {
                    userId: user.id,
                    street: data.shippingAddress.address,
                    city: data.shippingAddress.city,
                    state: "N/A", // Default or extract from zip
                    zip: data.shippingAddress.postalCode,
                    country: "USA", // Default
                }
            })

            // 4. Create the Order
            const order = await tx.order.create({
                data: {
                    userId: user.id,
                    storeId: store.id,
                    total: data.total,
                    status: "PENDING",
                    addressId: address.id,
                    items: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            })

            return order
        })

        revalidatePath("/admin/orders")
        // @ts-ignore
        revalidateTag("products")
        return { success: true, orderId: result.id }
    } catch (error: any) {
        console.error("Order creation failed:", error)
        return { error: error.message || "Failed to place order" }
    }
}

export async function updateProduct(id: string, formData: FormData) {
    const rawData = {
        name: formData.get("name"),
        description: formData.get("description"),
        price: formData.get("price"),
        stock: formData.get("stock"),
        categoryId: formData.get("categoryId"),
        status: formData.get("status"),
        images: formData.getAll("images") as string[],
    }

    const validated = productSchema.extend({
        status: z.string().optional()
    }).safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.flatten().fieldErrors }
    }

    try {
        await prisma.product.update({
            where: { id },
            data: {
                ...validated.data,
                price: validated.data.price,
                stock: validated.data.stock,
                status: (validated.data.status as any) || "ACTIVE",
            },
        })

        revalidatePath("/admin/products")
        revalidatePath("/")
        revalidatePath(`/product/${validated.data.name.toLowerCase().replace(/ /g, "-")}`)
        // @ts-ignore
        revalidateTag("products")
        return { success: true }
    } catch (error) {
        console.error("Failed to update product:", error)
        return { error: "Failed to update product" }
    }
}

export async function getSettings(subdomain?: string) {
    try {
        if (!subdomain) {
            const hostname = (await headers()).get("host") || ""
            subdomain = hostname.split(".")[0]
        }

        const settings = await prisma.settings.findFirst({
            where: { store: { subdomain } }
        })
        return settings
    } catch (error) {
        console.error("Failed to get settings:", error)
        return null
    }
}
