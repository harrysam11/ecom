import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, Package } from "lucide-react"
import { prisma } from "@/lib/prisma"

export default async function OrderConfirmationPage({
    searchParams
}: {
    searchParams: Promise<{ orderId: string }>
}) {
    const { orderId } = await searchParams

    const order = orderId ? await prisma.order.findUnique({
        where: { id: orderId }
    }) : null

    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 py-20 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-6 dark:bg-green-900/30">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="mb-2 text-3xl font-bold font-serif tracking-tight sm:text-4xl">
                Order Confirmed!
            </h1>
            {order ? (
                <div className="mb-8 space-y-2">
                    <p className="text-muted-foreground text-lg">
                        Thank you for your purchase, <span className="font-semibold text-black">{order.orderNumber || order.id.slice(0, 8)}</span> has been placed.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Package className="h-4 w-4" />
                        <span>Tracking information will be sent via email.</span>
                    </div>
                </div>
            ) : (
                <p className="mb-8 max-w-[600px] text-muted-foreground text-lg">
                    Thank you for your purchase. We have received your order and will send you a confirmation email shortly.
                </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                    <Button size="lg" className="rounded-none uppercase tracking-widest h-12 px-8">
                        Continue Shopping
                    </Button>
                </Link>
                <Link href="/">
                    <Button variant="outline" size="lg" className="rounded-none uppercase tracking-widest h-12 px-8">
                        Return Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}
