import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Star, Heart } from "lucide-react"

// Mock data (same as in other files, ideally should be central)
const MOCK_PRODUCTS = [
    {
        id: "1",
        name: "Premium Wireless Headphones",
        description: "Experience crystal clear sound with our noise-cancelling headphones. Features 30-hour battery life, plush ear cushions, and seamless Bluetooth connectivity.",
        price: 299.99,
        stock: 10,
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"],
        categoryId: "tech",
        slug: "wireless-headphones",
        features: ["Noise Cancellation", "30h Battery", "Bluetooth 5.0"]
    },
    {
        id: "2",
        name: "Minimalist Watch",
        description: "Elegant design meets precision engineering. A timeless piece for any occasion.",
        price: 149.50,
        stock: 5,
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80"],
        categoryId: "accessories",
        slug: "minimalist-watch",
        features: ["Genuine Leather", "Water Resistant", "Automatic Movement"]
    },
    {
        id: "3",
        name: "Smart Fitness Tracker",
        description: "Track your health and fitness goals with ease.",
        price: 89.99,
        stock: 20,
        images: ["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80"],
        categoryId: "tech",
        slug: "fitness-tracker",
        features: ["Heart Rate Monitor", "Sleep Tracking", "GPS"]
    },
    {
        id: "4",
        name: "Leather Backpack",
        description: "Durable and stylish backpack for everyday use.",
        price: 199.00,
        stock: 0,
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"],
        categoryId: "fashion",
        slug: "leather-backpack",
        features: ["Full Grain Leather", "Laptop Sleeve", "Lifetime Warranty"]
    },
    {
        id: "5",
        name: "Ergonomic Office Chair",
        description: "Work in comfort with our top-rated ergonomic chair.",
        price: 350.00,
        stock: 3,
        images: ["https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&q=80"],
        categoryId: "furniture",
        slug: "ergonomic-chair",
        features: ["Lumbar Support", "Adjustable Height", "Breathable Mesh"]
    },
]

export default function ProductPage({ params }: { params: { slug: string } }) {
    const product = MOCK_PRODUCTS.find((p) => p.slug === params.slug)

    if (!product) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Images */}
                <div className="relative aspect-square overflow-hidden rounded-lg bg-muted border">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Details */}
                <div className="flex flex-col space-y-6">
                    <div>
                        <div className="flex items-center justify-between">
                            <Badge variant="outline" className="mb-2 capitalize">{product.categoryId}</Badge>
                            {product.stock <= 0 && <Badge variant="destructive">Out of Stock</Badge>}
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
                        <div className="mt-2 flex items-center space-x-2 text-sm text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-muted-foreground ml-2">(4.9) • 120 reviews</span>
                        </div>
                    </div>

                    <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>

                    <p className="text-muted-foreground">{product.description}</p>

                    <Separator />

                    {product.features && (
                        <ul className="space-y-2 text-sm">
                            {product.features.map((feature, i) => (
                                <li key={i} className="flex items-center">
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex space-x-4 pt-4">
                        <Button size="lg" className="flex-1" disabled={product.stock <= 0}>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                        </Button>
                        <Button variant="outline" size="lg" className="px-3">
                            <Heart className="h-5 w-5" />
                            <span className="sr-only">Add to Wishlist</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
