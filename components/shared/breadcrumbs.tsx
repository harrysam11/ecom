"use client"

import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
    className?: string
}

export default function Breadcrumbs({ items, className }: BreadcrumbsProps) {
    return (
        <nav className={cn("flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground", className)}>
            <Link href="/" className="hover:text-black transition-colors flex items-center gap-1">
                <Home className="h-3 w-3" />
                <span className="hidden sm:inline">Home</span>
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <ChevronRight className="h-3 w-3 opacity-20" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-black transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-black font-bold">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    )
}
