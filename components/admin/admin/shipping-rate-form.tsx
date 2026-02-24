"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createShippingRate } from "@/lib/admin-actions"
import { toast } from "sonner"

export function ShippingRateForm({ zoneId }: { zoneId: string }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [price, setPrice] = useState("")
    const [minWeight, setMinWeight] = useState("0")
    const [maxWeight, setMaxWeight] = useState("")
    const [days, setDays] = useState("")

    async function onSubmit() {
        if (!price) return
        setLoading(true)
        try {
            const res = await createShippingRate({
                zoneId,
                flatPrice: Number(price),
                minWeight: Number(minWeight),
                maxWeight: maxWeight ? Number(maxWeight) : null,
                estimatedDays: days
            })
            if (res.success) {
                toast.success("Shipping rate added")
                setOpen(false)
                setPrice("")
                setMinWeight("0")
                setMaxWeight("")
                setDays("")
            } else {
                toast.error(res.error)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1 h-7">
                    <Plus className="h-3 w-3" />
                    <span>Rate</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-serif">Add Shipping Rate</DialogTitle>
                    <DialogDescription>
                        Set pricing based on weight and destination.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input id="price" type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="days">Est. Delivery Time</Label>
                            <Input id="days" placeholder="3-5 business days" value={days} onChange={e => setDays(e.target.value)} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="min">Min Weight (kg)</Label>
                            <Input id="min" type="number" step="0.1" value={minWeight} onChange={e => setMinWeight(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="max">Max Weight (kg)</Label>
                            <Input id="max" type="number" step="0.1" placeholder="Optional" value={maxWeight} onChange={e => setMaxWeight(e.target.value)} />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading} onClick={onSubmit}>
                        {loading ? "Adding..." : "Add Rate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
