import { prisma } from "@/lib/prisma"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
    })

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <ProductForm categories={categories} />
        </div>
    )
}
