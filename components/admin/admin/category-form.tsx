"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createCategory, updateCategory } from "@/lib/admin-actions"

const categorySchema = z.object({
    name: z.string().min(1, "Name is required"),
    slug: z.string().min(1, "Slug is required"),
    parentId: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface CategoryFormProps {
    initialData?: any
    categories: { id: string, name: string }[]
}

export function CategoryForm({ initialData, categories }: CategoryFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
        defaultValues: initialData || {
            name: "",
            slug: "",
            parentId: "",
            image: "",
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

    async function onSubmit(data: CategoryFormValues) {
        setLoading(true)
        try {
            let res
            if (initialData) {
                res = await updateCategory(initialData.id, data)
            } else {
                res = await createCategory(data)
            }

            if (res.success) {
                toast.success(initialData ? "Category updated" : "Category created")
                router.push("/categories")
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-2xl">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold font-serif tracking-tight">
                            {initialData ? "Edit Category" : "Create Category"}
                        </h2>
                    </div>
                    <Button disabled={loading} type="submit" className="gap-2">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {initialData ? "Save changes" : "Create"}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-serif">Category Details</CardTitle>
                        <CardDescription>Enter the basic information for this category.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Electronics" {...field} />
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
                                        <Input disabled={loading} placeholder="electronics" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="parentId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Category</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value || ""}
                                        defaultValue={field.value || ""}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="None (Top Level)" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="">None (Top Level)</SelectItem>
                                            {categories.filter(c => c.id !== initialData?.id).map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="https://..." {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
