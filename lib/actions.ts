"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath, revalidateTag } from "next/cache"
import { z } from "zod"
import { headers } from "next/headers"
import { getUser } from "@/lib/auth-actions"
import { calculateAppFee } from "@/lib/pricing"

export async function getCategories() {
    const hostnameWithPort = (await headers()).get("host") || ""
    const hostname = hostnameWithPort.split(":")[0]
    const rootDomains = ["localhost", "ecom-saas.com"]
    const subdomain = rootDomains.includes(hostname) ? "platform" : hostnameWithPort.split(".")[0]
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
        const hostnameWithPort = (await headers()).get("host") || ""
        const hostname = hostnameWithPort.split(":")[0]
        const rootDomains = ["localhost", "ecom-saas.com"]
        const subdomain = rootDomains.includes(hostname) ? "platform" : hostnameWithPort.split(".")[0]
        const store = await prisma.store.findUnique({ where: { subdomain } })

        if (!store) return { error: "Store not found" }

        const result = await prisma.$transaction(async (tx) => {
            // Check stock
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

            const address = await tx.address.create({
                data: {
                    userId: user.id,
                    street: data.shippingAddress.address,
                    city: data.shippingAddress.city,
                    state: "N/A",
                    zip: data.shippingAddress.postalCode,
                    country: "USA",
                }
            })

            const commissionFee = calculateAppFee(data.total, store.plan)

            const order = await tx.order.create({
                data: {
                    userId: user.id,
                    storeId: store.id,
                    total: data.total,
                    commissionFee: commissionFee,
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

export async function getSettings(subdomain?: string) {
    try {
        if (!subdomain) {
            const hostnameWithPort = (await headers()).get("host") || ""
            const hostname = hostnameWithPort.split(":")[0]
            const rootDomains = ["localhost", "ecom-saas.com"]
            subdomain = rootDomains.includes(hostname) ? "platform" : hostnameWithPort.split(".")[0]
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

// Analytics Action for Admin Dashboard
export async function getStoreAnalytics() {
    try {
        const hostnameWithPort = (await headers()).get("host") || ""
        const hostname = hostnameWithPort.split(":")[0]
        const rootDomains = ["localhost", "ecom-saas.com"]
        const subdomain = rootDomains.includes(hostname) ? "platform" : hostnameWithPort.split(".")[0]

        const orders = await prisma.order.findMany({
            where: {
                store: { subdomain },
                status: "PAID"
            },
            select: { total: true }
        })

        const totalSales = orders.reduce((acc, order) => acc + Number(order.total), 0)
        const totalOrders = orders.length

        return {
            totalSales,
            totalOrders,
        }
    } catch (error) {
        console.error("Failed to get analytics:", error)
        return { totalSales: 0, totalOrders: 0 }
    }
}
