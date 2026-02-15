export type Product = {
    id: string
    name: string
    description: string
    price: number
    stock: number
    images: string[]
    categoryId: string;
    slug: string;
    features?: string[];
}

export type Category = {
    id: string
    name: string
    slug: string
    image?: string
}

export type CartItem = {
    productId: string
    quantity: number
    product: Product
}
