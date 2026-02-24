"use client"

import { useState } from "react"
import { Search, Package, Truck, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState<any>(null)
    const [error, setError] = useState("")

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setOrder(null)

        try {
            // Mock API call - in real app, fetch from /api/orders/track
            await new Promise(r => setTimeout(r, 1000))

            // Simulation
            if (orderId && email) {
                setOrder({
                    id: orderId,
                    status: "SHIPPED",
                    courier: "FedEx",
                    trackingNumber: "FDX123456789",
                    items: 3,
                    total: 245.99,
                    timeline: [
                        { status: "Order Placed", date: "Oct 12, 2026", done: true },
                        { status: "Packed", date: "Oct 13, 2026", done: true },
                        { status: "Shipped", date: "Oct 14, 2026", done: true, active: true },
                        { status: "Out for Delivery", date: "-", done: false },
                        { status: "Delivered", date: "-", done: false },
                    ]
                })
            } else {
                setError("Please enter both Order ID and Email")
            }
        } catch (err) {
            setError("Order not found. Please check your details.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold tracking-tight mb-4">Track Your Order</h1>
                <p className="text-muted-foreground">Enter your details to see the current status of your shipment.</p>
            </div>

            <Card className="mb-12 shadow-xl border-t-4 border-t-primary">
                <CardHeader>
                    <CardTitle className="font-serif">Order Details</CardTitle>
                    <CardDescription>Found in your confirmation email.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                        <Input
                            placeholder="Order ID (e.g. #ORD123)"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button type="submit" disabled={loading} className="gap-2 px-8">
                            {loading ? "Searching..." : <Search className="h-4 w-4" />}
                            Track
                        </Button>
                    </form>
                    {error && <p className="text-destructive text-sm mt-4 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" /> {error}
                    </p>}
                </CardContent>
            </Card>

            {order && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="font-serif">Status: <span className="text-primary">{order.status}</span></CardTitle>
                                <CardDescription>Tracking via {order.courier}</CardDescription>
                            </div>
                            <Badge variant="outline" className="text-lg py-1 px-4 font-mono">{order.trackingNumber}</Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="relative mt-8">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>
                                <div className="space-y-10 relative">
                                    {order.timeline.map((item: any, idx: number) => (
                                        <div key={idx} className="flex gap-6 items-start">
                                            <div className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background ${item.done ? "border-primary text-primary" : "border-muted text-muted"}`}>
                                                {item.done ? <CheckCircle2 className="h-5 w-5 fill-primary text-white" /> : <Clock className="h-4 w-4" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className={`font-bold ${item.active ? "text-primary text-lg" : "text-muted-foreground"}`}>{item.status}</span>
                                                <span className="text-xs text-muted-foreground">{item.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Need help? <a href="/contact" className="text-primary hover:underline font-bold">Contact Support</a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
