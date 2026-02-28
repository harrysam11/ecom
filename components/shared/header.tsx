"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Heart, Menu, User, ChevronDown } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import CartDrawer from "./cart-drawer"
import GlobalSearch from "./global-search"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

export default function Header({ siteName = "ECOM" }: { siteName?: string }) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full transition-all duration-500",
                scrolled
                    ? "bg-white/80 backdrop-blur-md py-2 shadow-sm border-b"
                    : "bg-transparent py-4 border-b-transparent"
            )}
        >
            <div className="container mx-auto flex h-14 items-center px-4 md:px-6">
                <div className="flex items-center gap-2 md:gap-4 lg:gap-8">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                            <SheetHeader>
                                <SheetTitle className="text-left font-serif tracking-widest uppercase">Navigation</SheetTitle>
                            </SheetHeader>
                            <nav className="flex flex-col gap-6 mt-12">
                                <Link href="/" className="text-2xl font-light hover:text-[var(--primary)] transition-colors">Home</Link>
                                <Link href="/products" className="text-2xl font-light hover:text-[var(--primary)] transition-colors">Shop All</Link>
                                <Link href="/categories" className="text-2xl font-light hover:text-[var(--primary)] transition-colors">Collections</Link>
                                <Link href="/about" className="text-2xl font-light hover:text-[var(--primary)] transition-colors">Manifesto</Link>
                            </nav>
                        </SheetContent>
                    </Sheet>

                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-serif font-black text-2xl tracking-[0.2em] transition-transform duration-500 hover:scale-105">{siteName}</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.2em]">
                        <div className="group relative">
                            <Link href="/products" className="flex items-center gap-1 transition-colors hover:text-[var(--primary)]/60">
                                Shop <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                            </Link>
                            {/* Mega Menu Mock */}
                            <div className="absolute top-full left-0 w-[600px] bg-white border p-8 mt-4 opacity-0 invisible translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl z-50 rounded-lg">
                                <div className="grid grid-cols-3 gap-8 text-black">
                                    <div className="space-y-4">
                                        <h4 className="font-bold border-b pb-2">Essentials</h4>
                                        <ul className="space-y-2 font-light normal-case tracking-normal text-muted-foreground">
                                            <li><Link href="/products?category=new" className="hover:text-[var(--primary)] transition-colors">New Arrivals</Link></li>
                                            <li><Link href="/products?category=best" className="hover:text-[var(--primary)] transition-colors">Best Sellers</Link></li>
                                            <li><Link href="/products?category=sale" className="hover:text-[var(--primary)] transition-colors">Special Offers</Link></li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-bold border-b pb-2">Collections</h4>
                                        <ul className="space-y-2 font-light normal-case tracking-normal text-muted-foreground">
                                            <li><Link href="/products?category=minimal" className="hover:text-[var(--primary)] transition-colors">Minimalist</Link></li>
                                            <li><Link href="/products?category=luxury" className="hover:text-[var(--primary)] transition-colors">Luxury</Link></li>
                                            <li><Link href="/products?category=eco" className="hover:text-[var(--primary)] transition-colors">Eco Friendly</Link></li>
                                        </ul>
                                    </div>
                                    <div className="bg-secondary p-4 flex flex-col justify-end aspect-square rounded-md overflow-hidden relative group/img">
                                        <div className="z-10 relative">
                                            <p className="text-[10px] opacity-60">Featured</p>
                                            <p className="text-sm font-bold">2026 Collection</p>
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link href="/categories" className="transition-colors hover:text-[var(--primary)]/60">Curations</Link>
                        <Link href="/deals" className="transition-colors hover:text-[var(--primary)]/60 text-destructive">Archive</Link>
                    </nav>
                </div>

                <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-6">
                    <div className="hidden lg:flex flex-1 max-w-xs items-center">
                        <Suspense fallback={<div className="w-full h-10 bg-muted/20 rounded-md animate-pulse" />}>
                            <GlobalSearch />
                        </Suspense>
                    </div>

                    <div className="flex items-center gap-1 md:gap-3">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" className="group rounded-full hover:bg-black/5">
                            <Heart className="h-4 w-4 transition-transform group-hover:scale-110" />
                            <span className="sr-only">Wishlist</span>
                        </Button>

                        <CartDrawer />

                        <Link href="/signup" className="hidden sm:inline-block mr-2">
                            <Button variant="outline" size="sm">
                                Sign Up
                            </Button>
                        </Link>

                        <Link href="/login" className="hidden sm:inline-block">
                            <Button variant="ghost" size="icon" className="group rounded-full hover:bg-black/5">
                                <User className="h-4 w-4 transition-transform group-hover:scale-110" />
                                <span className="sr-only">Account</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}
