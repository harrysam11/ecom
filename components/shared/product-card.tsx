"use client"

import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/store/use-cart-store"
import { toast } from "sonner"
import { FadeIn } from "./animation-wrapper"

interface ProductCardProps {
    product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = () => {
        addItem(product)
        toast.success("Added to cart")
    }

    return (
        <FadeIn direction="up" duration={0.6}>
            <Card className="group overflow-hidden rounded-none border-none shadow-none bg-transparent transition-all duration-500 hover:shadow-2xl hover:shadow-black/5">
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                    <Link href={`/product/${product.slug}`}>
                        <Image
                            src={product.images[0] || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </Link>
                    <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {product.stock <= 0 && (
                        <Badge variant="secondary" className="absolute top-4 left-4 rounded-none px-3 py-1.5 text-[10px] uppercase tracking-widest bg-white text-black font-bold shadow-lg">Sold Out</Badge>
                    )}
                </div>
                <CardContent className="p-6 text-center space-y-2">
                    <Link href={`/product/${product.slug}`} className="hover:opacity-70 transition-opacity">
                        <h3 className="line-clamp-1 text-sm font-semibold tracking-[0.1em] uppercase">{product.name}</h3>
                    </Link>
                    <p className="text-xs font-light text-muted-foreground tracking-widest">
                        ${product.price.toFixed(2)}
                    </p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0 justify-center">
                    <Button
                        className="w-full opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 rounded-none h-11 tracking-[0.2em] uppercase text-[10px] font-bold bg-black text-white hover:bg-black/80"
                        size="sm"
                        disabled={product.stock <= 0}
                        onClick={handleAddToCart}
                    >
                        Quick Add
                    </Button>
                </CardFooter>
            </Card>
        </FadeIn>
    )
}
