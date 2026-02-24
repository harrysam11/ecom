import { prisma } from "@/lib/prisma"
import { CategoryForm } from "@/components/admin/admin/category-form"
import { getStoreOrThrow } from "@/lib/store"

export default async function NewCategoryPage() {
    const store = await getStoreOrThrow()
    const categories = await prisma.category.findMany({
        where: { storeId: store.id },
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
