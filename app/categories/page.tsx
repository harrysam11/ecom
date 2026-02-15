import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const CATEGORIES = [
    { id: "1", name: "Technology", slug: "tech", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500&q=80" },
    { id: "2", name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80" },
    { id: "3", name: "Accessories", slug: "accessories", image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=500&q=80" },
    { id: "4", name: "Furniture", slug: "furniture", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&q=80" },
]

export default function CategoriesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold tracking-tight">Shop by Category</h1>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {CATEGORIES.map((category) => (
                    <Link key={category.id} href={`/products?category=${category.slug}`}>
                        <Card className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                            <div className="aspect-video relative">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors hover:bg-black/50">
                                    <h2 className="text-2xl font-bold text-white tracking-widest uppercase">{category.name}</h2>
                                </div>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
