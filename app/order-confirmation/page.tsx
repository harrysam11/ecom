import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"

export default function OrderConfirmationPage() {
    return (
        <div className="flex h-[80vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-6 rounded-full bg-green-100 p-6 dark:bg-green-900/30">
                <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="mb-2 text-3xl font-bold font-serif tracking-tight sm:text-4xl">
                Order Confirmed!
            </h1>
            <p className="mb-8 max-w-[600px] text-muted-foreground text-lg">
                Thank you for your purchase. We have received your order and will send you a confirmation email shortly.
            </p>
            <div className="flex gap-4">
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
