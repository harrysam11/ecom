"use client"

import { useState } from "react"
import { Plus, Trash2, Box } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Variant {
    id?: string
    name: string
    price: number
    stock: number
}

interface ProductVariantsProps {
    initialVariants: Variant[]
    onChange: (variants: Variant[]) => void
}

export function ProductVariants({ initialVariants, onChange }: ProductVariantsProps) {
    const [variants, setVariants] = useState<Variant[]>(initialVariants || [])

    const addVariant = () => {
        const newVariants = [...variants, { name: "", price: 0, stock: 0 }]
        setVariants(newVariants)
        onChange(newVariants)
    }

    const removeVariant = (index: number) => {
        const newVariants = variants.filter((_, i) => i !== index)
        setVariants(newVariants)
        onChange(newVariants)
    }

    const updateVariant = (index: number, field: keyof Variant, value: any) => {
        const newVariants = [...variants]
        newVariants[index] = { ...newVariants[index], [field]: value }
        setVariants(newVariants)
        onChange(newVariants)
    }

    return (
        <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Box className="h-5 w-5" />
                    Product Variants
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Variant
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {variants.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4 italic">
                        No variants added. Add variants for products with multiple sizes, colors, etc.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {variants.map((variant, index) => (
                            <div key={index} className="flex gap-4 items-end border p-3 rounded-lg bg-muted/5">
                                <div className="flex-1 space-y-2">
                                    <Label className="text-xs">Variant Name (e.g. Size: XL, Color: Blue)</Label>
                                    <Input
                                        value={variant.name}
                                        placeholder="Option combination"
                                        onChange={(e) => updateVariant(index, "name", e.target.value)}
                                    />
                                </div>
                                <div className="w-24 space-y-2">
                                    <Label className="text-xs">Price ($)</Label>
                                    <Input
                                        type="number"
                                        value={variant.price}
                                        onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="w-24 space-y-2">
                                    <Label className="text-xs">Stock</Label>
                                    <Input
                                        type="number"
                                        value={variant.stock}
                                        onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value))}
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => removeVariant(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
