"use client"

import Link from "next/link"
import { CircleUser, Menu, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { signOut } from "next-auth/react"

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/admin",
    },
    {
        title: "Products",
        href: "/admin/products",
    },
    {
        title: "Orders",
        href: "/admin/orders",
    },
    {
        title: "Customers",
        href: "/admin/customers",
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
    },
    {
        title: "Settings",
        href: "/admin/settings",
    },
]

export default function AdminHeader() {
    const pathname = usePathname()
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                    <nav className="grid gap-2 text-lg font-medium">
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <span className="font-serif tracking-widest">ECOM ADMIN</span>
                        </Link>
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground",
                                    pathname === item.href ? "bg-muted text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="w-full flex-1">

            </div>
            <ModeToggle />

            <Link href="/">
                <Button variant="ghost" size="icon" title="View Store">
                    <Home className="h-5 w-5" />
                </Button>
            </Link>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
