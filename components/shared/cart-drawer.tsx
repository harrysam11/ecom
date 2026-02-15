"use client"

import { useCartStore } from "@/store/use-cart-store"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShoppingCart, Trash2, Plus, Minus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function CartDrawer() {
    const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
    const [isMounted, setIsMounted] = useState(false)

    // Prevent hydration mismatch for persistent store
    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    const itemCount = items.reduce((total, item) => total + item.quantity, 0)

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {itemCount}
                        </span>
                    )}
                    <span className="sr-only">Open cart</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-1">
                    <SheetTitle className="font-serif text-xl tracking-wide uppercase">My Cart ({itemCount})</SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />

                {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center space-y-4">
                        <ShoppingCart className="h-16 w-16 text-muted-foreground/50" />
                        <div className="text-xl font-medium text-muted-foreground">Your cart is empty</div>
                        <SheetClose asChild>
                            <Button variant="outline" className="mt-4">
                                Continue Shopping
                            </Button>
                        </SheetClose>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 pr-4">
                            <div className="space-y-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex space-x-4">
                                        <div className="relative h-24 w-24 overflow-hidden rounded-md border bg-muted">
                                            <Image
                                                src={item.images[0] ?? "/placeholder.png"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col justify-between">
                                            <div className="grid gap-1">
                                                <h4 className="font-serif font-medium line-clamp-1">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground capitalize">{item.categoryId}</p>
                                                <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 border rounded-md">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                                        <Minus className="h-3 w-3" />
                                                    </Button>
                                                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                                                        <Plus className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                    onClick={() => removeItem(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Remove</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="space-y-4 pr-6 pt-6">
                            <Separator />
                            <div className="space-y-1.5 text-sm">
                                <div className="flex">
                                    <span className="flex-1">Subtotal</span>
                                    <span className="font-bold">${totalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex">
                                    <span className="flex-1 text-muted-foreground">Shipping</span>
                                    <span className="text-muted-foreground">Calculated at checkout</span>
                                </div>
                            </div>
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Link href="/checkout" className="w-full">
                                        <Button className="w-full h-12 rounded-none tracking-widest uppercase font-semibold">
                                            Proceed to Checkout
                                        </Button>
                                    </Link>
                                </SheetClose>
                            </SheetFooter>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}
