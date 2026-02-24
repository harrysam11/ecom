"use client"

import { useCartStore } from "@/store/use-cart-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { createOrder } from "@/lib/actions"

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore()
    const router = useRouter()
    const [isMounted, setIsMounted] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        postalCode: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        const key = id.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) as keyof typeof formData
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) return null

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-serif font-bold mb-4">Your Cart is Empty</h1>
                <p className="mb-8 text-muted-foreground">Add some premium items to your cart to proceed.</p>
                <Button onClick={() => router.push('/products')}>Browse Collection</Button>
            </div>
        )
    }

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await createOrder({
            items: items.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            })),
            total: totalPrice(),
            shippingAddress: formData
        })

        if (result.error) {
            toast.error(result.error)
        } else {
            clearCart()
            toast.success("Order placed successfully!")
            router.push(`/order-confirmation?orderId=${result.orderId}`)
        }
        setLoading(false)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold font-serif tracking-tight">Checkout</h1>

            <form onSubmit={handleCheckout} className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-8">
                    <Card className="rounded-none border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif tracking-wide">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    required
                                    className="rounded-none"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif tracking-wide">Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input
                                        id="first-name"
                                        required
                                        className="rounded-none"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input
                                        id="last-name"
                                        required
                                        className="rounded-none"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    placeholder="123 Premium St"
                                    required
                                    className="rounded-none"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        required
                                        className="rounded-none"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postal-code">Postal Code</Label>
                                    <Input
                                        id="postal-code"
                                        required
                                        className="rounded-none"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-none border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle className="font-serif tracking-wide">Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup defaultValue="cod">
                                <div className="flex items-center space-x-2 border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="card" id="card" disabled />
                                    <Label htmlFor="card" className="flex-1 cursor-pointer text-muted-foreground">Credit / Debit Card (Razorpay) - Coming Soon</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-4 mt-[-1px] cursor-pointer hover:bg-muted/50 transition-colors">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery</Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card className="sticky top-20 rounded-none border-border/50 shadow-md bg-muted/20">
                        <CardHeader>
                            <CardTitle className="font-serif tracking-wide">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative h-16 w-16 overflow-hidden rounded-md border bg-muted">
                                            <Image
                                                src={item.images[0] || "/placeholder.png"}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="flex flex-1 flex-col justify-center">
                                            <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                            <p className="text-sm text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator />

                            <div className="space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Subtotal</span>
                                    <span className="text-sm font-medium">${totalPrice().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Shipping</span>
                                    <span className="text-sm font-medium">Free</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-muted-foreground">Tax</span>
                                    <span className="text-sm font-medium text-muted-foreground">$0.00</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between">
                                <span className="text-lg font-bold font-serif uppercase tracking-wide">Total</span>
                                <span className="text-lg font-bold">${totalPrice().toFixed(2)}</span>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 rounded-none tracking-widest uppercase font-semibold"
                                size="lg"
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Place Order"}
                            </Button>
                            <p className="text-xs text-center text-muted-foreground">
                                By placing your order, you agree to our Terms of Service.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}
