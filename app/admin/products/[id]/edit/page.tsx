import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { EditProductForm } from "@/components/admin/edit-product-form"

interface EditProductPageProps {
    params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const { id } = await params

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true
        }
    })

    if (!product) {
        notFound()
    }

    return <EditProductForm product={product} />
}
