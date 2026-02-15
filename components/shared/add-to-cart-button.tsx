"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Heart } from "lucide-react"
import { useCartStore } from "@/store/use-cart-store"
import { useWishlistStore } from "@/store/use-wishlist-store"
import { Product } from "@/types"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
    product: Product
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
    const addItem = useCartStore((state) => state.addItem)
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleAddToCart = () => {
        addItem(product)
        toast.success("Added to cart")
    }

    const handleToggleWishlist = () => {
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id)
            toast.info("Removed from wishlist")
        } else {
            addToWishlist(product)
            toast.success("Added to wishlist")
        }
    }

    // Prevent hydration mismatch
    if (!isMounted) {
        return (
            <div className="flex space-x-4 pt-4">
                <Button size="lg" className="flex-1 rounded-none uppercase tracking-widest font-semibold" disabled>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="px-3 rounded-none" disabled>
                    <Heart className="h-5 w-5" />
                    <span className="sr-only">Add to Wishlist</span>
                </Button>
            </div>
        )
    }

    const isWishlisted = isInWishlist(product.id)

    return (
        <div className="flex space-x-4 pt-4">
            <Button
                size="lg"
                className="flex-1 rounded-none uppercase tracking-widest font-semibold"
                disabled={product.stock <= 0}
                onClick={handleAddToCart}
            >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
            </Button>
            <Button
                variant="outline"
                size="lg"
                className={cn("px-3 rounded-none transition-colors", isWishlisted && "bg-accent text-accent-foreground border-accent-foreground/20")}
                onClick={handleToggleWishlist}
            >
                <Heart className={cn("h-5 w-5", isWishlisted && "fill-current text-red-500")} />
                <span className="sr-only">Add to Wishlist</span>
            </Button>
        </div>
    )
}
