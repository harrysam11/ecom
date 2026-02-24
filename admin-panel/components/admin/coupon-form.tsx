"use client"

import { useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { createCoupon, updateCoupon } from "@/lib/admin-actions"

const couponSchema = z.object({
    code: z.string().min(1, "Code is required").toUpperCase(),
    discountType: z.enum(["PERCENTAGE", "FIXED"]),
    discountValue: z.number().min(0),
    minCartValue: z.number().nullable(),
    usageLimit: z.number().int().nullable(),
    expiresAt: z.string().min(1, "Expiration date is required"),
    isActive: z.boolean(),
})

type CouponFormValues = z.infer<typeof couponSchema>

interface Coupon {
    id: string
    code: string
    discountType: "PERCENTAGE" | "FIXED"
    discountValue: any // Decimal from Prisma
    minCartValue: any // Decimal from Prisma
    usageLimit: number | null
    usageCount: number
    expiresAt: Date | string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

interface CouponFormProps {
    initialData?: Coupon
}

export function CouponForm({ initialData }: CouponFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<CouponFormValues>({
        resolver: zodResolver(couponSchema),
        defaultValues: initialData ? {
            code: initialData.code,
            discountType: initialData.discountType,
            discountValue: Number(initialData.discountValue),
            minCartValue: initialData.minCartValue ? Number(initialData.minCartValue) : null,
            usageLimit: initialData.usageLimit,
            expiresAt: new Date(initialData.expiresAt).toISOString().split("T")[0],
            isActive: initialData.isActive,
        } : {
            code: "",
            discountType: "FIXED",
            discountValue: 0,
            minCartValue: null,
            usageLimit: null,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            isActive: true,
        },
    })

    async function onSubmit(data: CouponFormValues) {
        setLoading(true)
        try {
            let res
            if (initialData) {
                res = await updateCoupon(initialData.id, data)
            } else {
                res = await createCoupon(data)
            }

            if (res.success) {
                toast.success(initialData ? "Coupon updated" : "Coupon created")
                router.push("/coupons")
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
                            {initialData ? "Edit Coupon" : "Create Coupon"}
                        </h2>
                    </div>
                    <Button disabled={loading} type="submit" className="gap-2">
                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {initialData ? "Save changes" : "Create"}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-serif">Coupon Configuration</CardTitle>
                        <CardDescription>Setup your discount code and limits.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Coupon Code</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="SUMMER25" {...field} />
                                    </FormControl>
                                    <FormDescription>Unique code for customers to use at checkout.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="discountType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Discount Type</FormLabel>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="FIXED">Fixed Amount ($)</SelectItem>
                                                <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discountValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
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
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="minCartValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Min Cart Value (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                disabled={loading}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="usageLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Usage Limit (Optional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={loading}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="expiresAt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Expiration Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" disabled={loading} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            disabled={loading}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Active Status</FormLabel>
                                        <FormDescription>
                                            If unchecked, the coupon cannot be used.
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>
            </form>
        </Form>
    )
}
