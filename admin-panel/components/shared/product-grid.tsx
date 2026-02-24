"use client"

import ProductCard from "@/components/shared/product-card"
import { Product } from "@/types"
import { useSearchParams } from "next/navigation"

const MOCK_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Premium Wireless Headphones",
        description: "Experience crystal clear sound with our noise-cancelling headphones.",
        price: 299.99,
        stock: 10,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"],
        categoryId: "tech",
        slug: "wireless-headphones",
        features: ["Noise Cancellation", "30h Battery"]
    },
    {
        id: "2",
        name: "Minimalist Watch",
        description: "Elegant design meets precision engineering.",
        price: 149.50,
        stock: 5,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"],
        categoryId: "accessories",
        slug: "minimalist-watch"
    },
    {
        id: "3",
        name: "Smart Fitness Tracker",
        description: "Track your health and fitness goals with ease.",
        price: 89.99,
        stock: 20,
        images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80"],
        categoryId: "tech",
        slug: "fitness-tracker"
    },
    {
        id: "4",
        name: "Leather Backpack",
        description: "Durable and stylish backpack for everyday use.",
        price: 199.00,
        stock: 0,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"],
        categoryId: "fashion",
        slug: "leather-backpack"
    },
    {
        id: "5",
        name: "Ergonomic Office Chair",
        description: "Work in comfort with our top-rated ergonomic chair.",
        price: 350.00,
        stock: 3,
        images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80"],
        categoryId: "furniture",
        slug: "ergonomic-chair"
    },
]

import { FadeIn, StaggerContainer } from "./animation-wrapper"

export default function ProductGrid() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q")?.toLowerCase() || ""

    const filteredProducts = MOCK_PRODUCTS.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(query) || product.description?.toLowerCase().includes(query)
        return matchesSearch
    })

    return (
        <StaggerContainer className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))
            ) : (
                <div className="col-span-full text-center py-20 text-muted-foreground font-light">
                    No products found matching &quot;{query}&quot;
                </div>
            )}
        </StaggerContainer>
    )
}
