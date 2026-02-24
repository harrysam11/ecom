import { notFound } from "next/navigation"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import { Star } from "lucide-react"
import AddToCartButton from "@/components/shared/add-to-cart-button"
import ProductReviews from "@/components/shared/product-reviews"
import Breadcrumbs from "@/components/shared/breadcrumbs"
import { FadeIn, StaggerContainer } from "@/components/shared/animation-wrapper"
import { prisma } from "@/lib/prisma"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const { slug, domain } = await params
    const product = await prisma.product.findUnique({
        where: { storeId_slug: { store: { subdomain: domain }, slug } }
    })

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

export default async function ProductPage({ params }: { params: Promise<{ slug: string, domain: string }> }) {
    const { slug, domain } = await params
    const product = await prisma.product.findUnique({
        where: { storeId_slug: { store: { subdomain: domain }, slug } },
        include: {
            category: true
        }
    })

    if (!product) {
        notFound()
    }

    // Adapt prisma product to the component's expected format if needed
    const formattedProduct = {
        ...product,
        price: Number(product.price),
        features: (product as any).features || [], // Handle features if they exist in schema or as a JSON field
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
                                    {product.category.name}
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

                        <p className="text-3xl font-light tracking-wide text-black">${Number(product.price).toFixed(2)}</p>

                        <p className="text-lg font-light leading-relaxed text-muted-foreground">{product.description}</p>

                        <Separator className="bg-black/5" />

                        {formattedProduct.features && formattedProduct.features.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-bold uppercase tracking-widest">Key Features</h3>
                                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-black">
                                    {formattedProduct.features.map((feature: string, i: number) => (
                                        <li key={i} className="flex items-center space-x-3 text-sm font-light">
                                            <div className="h-1.5 w-1.5 rounded-full bg-black/20" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="pt-6">
                            <AddToCartButton product={formattedProduct as any} />
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

            {/* Reviews removed for MVP simplification */}
        </div>
    )
}
