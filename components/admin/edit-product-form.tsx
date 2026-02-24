"use client"

import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Loader2 } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { updateProduct, getCategories } from "@/lib/actions"

interface EditProductFormProps {
    product: any
}

export function EditProductForm({ product }: EditProductFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([])
    const [selectedCategory, setSelectedCategory] = useState<string>(product.categoryId)
    const [status, setStatus] = useState<string>(product.status.toLowerCase())

    useEffect(() => {
        getCategories().then(setCategories)
    }, [])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        formData.append("categoryId", selectedCategory)
        formData.append("status", status.toUpperCase())

        startTransition(async () => {
            const result = await updateProduct(product.id, formData)
            if (result.error) {
                if (typeof result.error === "string") {
                    toast.error(result.error)
                } else {
                    toast.error("Please check the form for errors")
                    console.error(result.error)
                }
            } else {
                toast.success("Product updated successfully")
                router.push("/admin/products")
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="flex flex-col sm:gap-4 sm:py-4">
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
                        <div className="flex items-center gap-4">
                            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                                <Link href="/admin/products">
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sr-only">Back</span>
                                </Link>
                            </Button>
                            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                                Edit Product
                            </h1>
                            <Badge variant="outline" className="ml-auto sm:ml-0">
                                {product.stock > 0 ? "In stock" : "Out of stock"}
                            </Badge>
                            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                                <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                                    Discard
                                </Button>
                                <Button size="sm" type="submit" disabled={isPending}>
                                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Product
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Product Details</CardTitle>
                                        <CardDescription>
                                            Edit the details of your product.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    className="w-full"
                                                    defaultValue={product.name}
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    name="description"
                                                    className="min-h-32"
                                                    defaultValue={product.description}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Pricing & Stock</CardTitle>
                                        <CardDescription>
                                            Update the price and available quantity.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="grid gap-3">
                                                <Label htmlFor="price">Price ($)</Label>
                                                <Input
                                                    id="price"
                                                    name="price"
                                                    type="number"
                                                    step="0.01"
                                                    defaultValue={Number(product.price)}
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="stock">Quantity</Label>
                                                <Input
                                                    id="stock"
                                                    name="stock"
                                                    type="number"
                                                    defaultValue={product.stock}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Product Status</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-6">
                                            <div className="grid gap-3">
                                                <Label htmlFor="status">Status</Label>
                                                <Select value={status} onValueChange={setStatus}>
                                                    <SelectTrigger id="status" aria-label="Select status">
                                                        <SelectValue placeholder="Select status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-3">
                                                <Label htmlFor="category">Category</Label>
                                                <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                                                    <SelectTrigger id="category" aria-label="Select category">
                                                        <SelectValue placeholder="Select category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id}>
                                                                {cat.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="overflow-hidden">
                                    <CardHeader>
                                        <CardTitle>Product Images</CardTitle>
                                        <CardDescription>
                                            Product images (URL-based for now).
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid gap-2">
                                            <Image
                                                alt="Product image"
                                                className="aspect-square w-full rounded-md object-cover"
                                                height="300"
                                                src={product.images[0] || "/placeholder.png"}
                                                width="300"
                                            />
                                            <div className="grid grid-cols-3 gap-2">
                                                {product.images.slice(1, 4).map((img: string, i: number) => (
                                                    <Image
                                                        key={i}
                                                        alt="Product image"
                                                        className="aspect-square w-full rounded-md object-cover"
                                                        height="84"
                                                        src={img}
                                                        width="84"
                                                    />
                                                ))}
                                                <button type="button" className="flex aspect-square w-full items-center justify-center rounded-md border border-dashed">
                                                    <span className="sr-only">Upload</span>
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-2 md:hidden">
                            <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                                Discard
                            </Button>
                            <Button size="sm" type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Product
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </form>
    )
}
