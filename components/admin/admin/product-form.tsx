"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Plus, Trash2, Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createProduct, updateProduct } from "@/lib/admin-actions"

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be positive"),
    stock: z.number().int().min(0, "Stock must be positive"),
    lowStockThreshold: z.number().int().min(0),
    categoryId: z.string().min(1, "Category is required"),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    images: z.array(z.string()),
    variants: z.array(z.object({
        name: z.string(),
        price: z.number().optional(),
        stock: z.number().int(),
    })),
})

type ProductFormValues = z.infer<typeof productSchema>

interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: any // Decimal
    stock: number
    lowStockThreshold: number
    categoryId: string
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
    metaTitle?: string | null
    metaDescription?: string | null
    images: string[]
    variants?: {
        name: string
        price?: any // Decimal
        stock: number
    }[]
}

interface ProductFormProps {
    initialData?: Product
    categories: { id: string, name: string }[]
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: initialData ? {
            name: initialData.name,
            slug: initialData.slug,
            description: initialData.description,
            price: Number(initialData.price),
            stock: initialData.stock,
            lowStockThreshold: initialData.lowStockThreshold,
            categoryId: initialData.categoryId,
            status: initialData.status,
            metaTitle: initialData.metaTitle || "",
            metaDescription: initialData.metaDescription || "",
            images: initialData.images || [],
            variants: initialData.variants?.map(v => ({
                name: v.name,
                price: v.price ? Number(v.price) : undefined,
                stock: v.stock
            })) || [],
        } : {
            name: "",
            slug: "",
            description: "",
            price: 0,
            stock: 0,
            lowStockThreshold: 10,
            categoryId: "",
            status: "DRAFT",
            metaTitle: "",
            metaDescription: "",
            images: [],
            variants: [],
        },
    })

    const name = form.watch("name")
    useEffect(() => {
        if (!initialData && name) {
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "")
            form.setValue("slug", slug)
        }
    }, [name, form, initialData])

    async function onSubmit(data: ProductFormValues) {
        setLoading(true)
        try {
            let res
            if (initialData) {
                res = await updateProduct(initialData.id, data)
            } else {
                res = await createProduct(data)
            }

            if (res.success) {
                toast.success(initialData ? "Product updated" : "Product created")
                router.push("/products")
                router.refresh()
            } else {
                toast.error(res.error || "Something went wrong")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold font-serif tracking-tight">
                            {initialData ? "Edit Product" : "Create Product"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {initialData ? "Update the product details" : "Add a new product to your store"}
                        </p>
                    </div>
                    <Button disabled={loading} type="submit" className="gap-2">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {initialData ? "Save changes" : "Create"}
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-serif">General Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Product Name</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Premium Wireless Headphones" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="premium-wireless-headphones" {...field} />
                                            </FormControl>
                                            <FormDescription>The URL-friendly version of the name.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea disabled={loading} placeholder="Describe your product..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="font-serif">Pricing & Inventory</CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Base Price ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    disabled={loading}
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Stock</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    disabled={loading}
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="lowStockThreshold"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Low Stock Threshold</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    disabled={loading}
                                                    {...field}
                                                    onChange={e => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormDescription>Get alerts when stock falls below this.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="font-serif">Variants</CardTitle>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    disabled={loading}
                                    onClick={() => {
                                        const variants = form.getValues("variants")
                                        form.setValue("variants", [...variants, { name: "", stock: 0 }])
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Variant
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {form.watch("variants")?.map((_, index) => (
                                    <div key={index} className="flex gap-4 items-end">
                                        <FormField
                                            control={form.control}
                                            name={`variants.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormLabel>Variant Name</FormLabel>
                                                    <FormControl>
                                                        <Input disabled={loading} placeholder="Size: XL" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`variants.${index}.stock`}
                                            render={({ field }) => (
                                                <FormItem className="w-24">
                                                    <FormLabel>Stock</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            disabled={loading}
                                                            {...field}
                                                            onChange={e => field.onChange(Number(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            disabled={loading}
                                            onClick={() => {
                                                const variants = form.getValues("variants")
                                                form.setValue("variants", variants.filter((__, i) => i !== index))
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-serif">Status & Category</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <Select
                                                disabled={loading}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue defaultValue={field.value} placeholder="Select status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="DRAFT">Draft</SelectItem>
                                                    <SelectItem value="PUBLISHED">Published</SelectItem>
                                                    <SelectItem value="ARCHIVED">Archived</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Category</FormLabel>
                                            <Select
                                                disabled={loading}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue defaultValue={field.value} placeholder="Select a category" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categories.map((cat) => (
                                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="font-serif">SEO Data</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="metaTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Title</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Focus keyword here..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="metaDescription"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meta Description</FormLabel>
                                            <FormControl>
                                                <Textarea disabled={loading} placeholder="Compelling summary for search results..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    )
}
