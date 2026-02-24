import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { FadeIn, StaggerContainer } from "@/components/shared/animation-wrapper"
import { Badge } from "@/components/ui/badge"
import { unstable_cache } from "next/cache"

const getCategories = unstable_cache(
    async () => {
        return prisma.category.findMany({
            include: {
                products: {
                    take: 1,
                    orderBy: { createdAt: "desc" },
                    select: { images: true }
                }
            },
            orderBy: { name: "asc" }
        })
    },
    ["all-categories"],
    { revalidate: 3600, tags: ["categories"] }
)

export default async function CategoriesPage() {
    const categories = await getCategories()

    return (
        <div className="container mx-auto px-4 py-12 lg:py-20">
            <FadeIn>
                <div className="mb-12">
                    <Badge variant="outline" className="mb-4 uppercase tracking-widest text-[10px] rounded-none px-3">
                        Collections
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-serif font-light tracking-tight">Shop by Category</h1>
                </div>
            </FadeIn>

            {categories.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-black/10">
                    <p className="text-muted-foreground font-light italic">No collections available yet.</p>
                </div>
            ) : (
                <StaggerContainer className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((category) => {
                        const productWithImage = category.products[0]
                        const displayImage = productWithImage?.images[0] || "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80"

                        return (
                            <Link key={category.id} href={`/products?category=${category.slug}`}>
                                <Card className="overflow-hidden border-none group cursor-pointer h-[400px] relative">
                                    <Image
                                        src={displayImage}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center transition-all duration-500 group-hover:bg-black/20">
                                        <h2 className="text-3xl font-serif font-light text-white tracking-[0.2em] uppercase transition-transform duration-500 group-hover:scale-110">{category.name}</h2>
                                        <div className="h-[1px] w-0 bg-white mt-4 transition-all duration-500 group-hover:w-20" />
                                    </div>
                                </Card>
                            </Link>
                        )
                    })}
                </StaggerContainer>
            )}
        </div>
    )
}
