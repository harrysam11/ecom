import { prisma } from "@/lib/prisma"
import { CategoryForm } from "@/components/admin/category-form"

export default async function NewCategoryPage() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
    })

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CategoryForm categories={categories} />
        </div>
    )
}
