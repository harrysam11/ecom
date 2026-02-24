import { prisma } from "@/lib/prisma"
import ProductCard from "@/components/shared/product-card"
import { Badge } from "@/components/ui/badge"
import { FadeIn, StaggerContainer } from "@/components/shared/animation-wrapper"

export default async function ProductsPage({
    searchParams
}: {
    searchParams: Promise<{ category?: string }>
}) {
    const { category } = await searchParams

    const products = await prisma.product.findMany({
        where: {
            status: "PUBLISHED",
            ...(category ? {
                category: {
                    slug: category
                }
            } : {})
        },
        include: {
            category: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" }
    })

    return (
        <div className="container mx-auto px-4 py-12 lg:py-20">
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <Badge variant="outline" className="mb-4 uppercase tracking-widest text-[10px] rounded-none px-3">
                            Catalog
                        </Badge>
                        <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight">
                            {category
                                ? categories.find(c => c.slug === category)?.name || "Collection"
                                : "Discover All"}
                        </h1>
                    </div>
                </div>
            </FadeIn>

            {products.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-black/10">
                    <p className="text-muted-foreground font-light italic">No items found in this collection.</p>
                </div>
            ) : (
                <StaggerContainer className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product as any} />
                    ))}
                </StaggerContainer>
            )}
        </div>
    )
}
