import Link from "next/link"
import { LayoutDashboard, ShoppingBag, CreditCard, Store } from "lucide-react"

export function AdminNavbar() {
    return (
        <nav className="border-b bg-background">
            <div className="flex h-16 items-center px-8">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="font-bold text-xl mr-8">Platform Admin</Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link href="/" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link href="/products" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <ShoppingBag className="h-4 w-4" />
                            Products
                        </Link>
                        <Link href="/orders" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <CreditCard className="h-4 w-4" />
                            Orders
                        </Link>
                        <Link href="/stores" className="flex items-center gap-2 hover:text-primary transition-colors">
                            <Store className="h-4 w-4" />
                            Stores
                        </Link>
                    </nav>
                </div>
            </div>
        </nav>
    )
}
