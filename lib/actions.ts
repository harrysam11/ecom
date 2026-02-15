"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

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
        await prisma.product.create({
            data: {
                ...validated.data,
                price: validated.data.price,
                stock: validated.data.stock,
            },
        })

        revalidatePath("/admin/products")
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
        return { success: true }
    } catch (error) {
        console.error("Failed to delete product:", error)
        return { error: "Failed to delete product" }
    }
}

export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { name: "asc" },
    })
}
