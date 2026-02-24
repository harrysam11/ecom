"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"
import { useState, useEffect } from "react"

export default function GlobalSearch() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [term, setTerm] = useState(searchParams.get("q") || "")

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        if (term) {
            params.set("q", term)
        } else {
            params.delete("q")
        }
        router.replace(`/products?${params.toString()}`)
    }, 300)

    useEffect(() => {
        setTerm(searchParams.get("q") || "")
    }, [searchParams])

    return (
        <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                type="search"
                placeholder="Search products..."
                className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
                value={term}
                onChange={(e) => {
                    setTerm(e.target.value)
                    handleSearch(e.target.value)
                }}
            />
        </div>
    )
}
