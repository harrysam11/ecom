import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { Star, Check } from "lucide-react"
import AddToCartButton from "@/components/shared/add-to-cart-button"
import ProductReviews from "@/components/shared/product-reviews"
import { Product } from "@/types"
import Breadcrumbs from "@/components/shared/breadcrumbs"
import { FadeIn, StaggerContainer } from "@/components/shared/animation-wrapper"

// Mock data (same as in other files, ideally should be central)
const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Premium Wireless Headphones",
        description: "Experience crystal clear sound with our noise-cancelling headphones. Features 30-hour battery life, plush ear cushions, and seamless Bluetooth connectivity.",
        price: 299.99,
        stock: 10,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"],
        categoryId: "tech",
        slug: "wireless-headphones",
        features: ["Noise Cancellation", "30h Battery", "Bluetooth 5.0"]
    },
    {
        id: "2",
        name: "Minimalist Watch",
        description: "Elegant design meets precision engineering. A timeless piece for any occasion.",
        price: 149.50,
        stock: 5,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"],
        categoryId: "accessories",
        slug: "minimalist-watch",
        features: ["Genuine Leather", "Water Resistant", "Automatic Movement"]
    },
    {
        id: "3",
        name: "Smart Fitness Tracker",
        description: "Track your health and fitness goals with ease.",
        price: 89.99,
        stock: 20,
        images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80"],
        categoryId: "tech",
        slug: "fitness-tracker",
        features: ["Heart Rate Monitor", "Sleep Tracking", "GPS"]
    },
    {
        id: "4",
        name: "Leather Backpack",
        description: "Durable and stylish backpack for everyday use.",
        price: 199.00,
        stock: 0,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"],
        categoryId: "fashion",
        slug: "leather-backpack",
        features: ["Full Grain Leather", "Laptop Sleeve", "Lifetime Warranty"]
    },
    {
        id: "5",
        name: "Ergonomic Office Chair",
        description: "Work in comfort with our top-rated ergonomic chair.",
        price: 350.00,
        stock: 3,
        images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80"],
        categoryId: "furniture",
        slug: "ergonomic-chair",
        features: ["Lumbar Support", "Adjustable Height", "Breathable Mesh"]
    },
]

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug)

    if (!product) {
        return {
            title: "Product Not Found",
        }
    }

    return {
        title: `${product.name} | Ecom Store`,
        description: product.description,
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.images,
        },
    }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug)

    if (!product) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-12 lg:py-20">
            <FadeIn direction="down" delay={0.1} className="mb-8">
                <Breadcrumbs
                    items={[
                        { label: "Products", href: "/products" },
                        { label: product.name },
                    ]}
                />
            </FadeIn>

            <StaggerContainer className="grid grid-cols-1 gap-12 lg:gap-20 md:grid-cols-2">
                {/* Images */}
                <FadeIn direction="left" duration={0.8}>
                    <div className="relative aspect-square overflow-hidden rounded-none border border-border/50 bg-secondary/30">
                        <Image
                            src={product.images[0] || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-1000 hover:scale-105"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                </FadeIn>

                {/* Details */}
                <FadeIn direction="right" duration={0.8}>
                    <div className="flex flex-col space-y-8">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <Badge variant="outline" className="rounded-none border-black/10 px-3 py-1 text-[10px] uppercase tracking-widest bg-secondary/50">
                                    {product.categoryId}
                                </Badge>
                                {product.stock <= 0 && <Badge variant="destructive" className="rounded-none uppercase tracking-widest text-[10px]">Out of Stock</Badge>}
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter font-serif uppercase md:text-5xl lg:text-6xl text-black">
                                {product.name}
                            </h1>
                            <div className="mt-4 flex items-center space-x-2 text-[10px] text-yellow-500 tracking-widest font-bold uppercase">
                                <div className="flex">
                                    <Star className="h-3 w-3 fill-current" />
                                    <Star className="h-3 w-3 fill-current" />
                                    <Star className="h-3 w-3 fill-current" />
                                    <Star className="h-3 w-3 fill-current" />
                                    <Star className="h-3 w-3 fill-current" />
                                </div>
                                <span className="text-muted-foreground leading-none ml-2">4.9 • 120 Reviews</span>
                            </div>
                        </div>

                        <p className="text-3xl font-light tracking-wide text-black">${product.price.toFixed(2)}</p>

                        <p className="text-lg font-light leading-relaxed text-muted-foreground">{product.description}</p>

                        <Separator className="bg-black/5" />

                        {product.features && (
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-bold uppercase tracking-widest">Key Features</h3>
                                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-black">
                                    {product.features.map((feature, i) => (
                                        <li key={i} className="flex items-center space-x-3 text-sm font-light">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="pt-6">
                            <AddToCartButton product={product} />
                        </div>

                        <div className="flex items-center gap-8 pt-8 border-t border-black/5 text-[9px] uppercase tracking-[0.2em] font-bold opacity-60">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                Ready for Dispatch
                            </div>
                            <span>Extended Warranty Available</span>
                        </div>
                    </div>
                </FadeIn>
            </StaggerContainer>

            <div className="mt-24 lg:mt-32 border-t border-black/5 pt-24">
                <FadeIn direction="up">
                    <ProductReviews />
                </FadeIn>
            </div>
        </div>
    )
}
