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
import { createShippingZone } from "@/lib/admin-actions"
import { toast } from "sonner"

export function ShippingZoneForm() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [countries, setCountries] = useState("")

    async function onSubmit() {
        if (!name || !countries) return
        setLoading(true)
        try {
            const res = await createShippingZone({
                name,
                countries: countries.split(",").map(c => c.trim().toUpperCase()),
                states: []
            })
            if (res.success) {
                toast.success("Shipping zone created")
                setOpen(false)
                setName("")
                setCountries("")
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
                <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Zone
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="font-serif">New Shipping Zone</DialogTitle>
                    <DialogDescription>
                        Create a region for your shipping rates.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Zone Name</Label>
                        <Input id="name" placeholder="Domestic, International, etc." value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="countries">Countries (ISO Codes)</Label>
                        <Input id="countries" placeholder="IN, US, CA" value={countries} onChange={e => setCountries(e.target.value)} />
                        <p className="text-[10px] text-muted-foreground">Comma separated ISO codes.</p>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading} onClick={onSubmit}>
                        {loading ? "Creating..." : "Save Zone"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
