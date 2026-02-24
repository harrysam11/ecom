"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { updateOrderStatus, updateOrderTracking } from "@/lib/admin-actions"

interface OrderStatusManagerProps {
    orderId: string
    status: string
    trackingNumber: string
    courierName: string
}

export function OrderStatusManager({ orderId, status, trackingNumber, courierName }: OrderStatusManagerProps) {
    const [loading, setLoading] = useState(false)
    const [tracking, setTracking] = useState(trackingNumber)
    const [courier, setCourier] = useState(courierName)

    const onStatusChange = async (newStatus: string) => {
        setLoading(true)
        try {
            const res = await updateOrderStatus(orderId, newStatus)
            if (res.success) {
                toast.success(`Order marked as ${newStatus}`)
            } else {
                toast.error(res.error)
            }
        } finally {
            setLoading(false)
        }
    }

    const onFulfillmentUpdate = async () => {
        setLoading(true)
        try {
            const res = await updateOrderTracking(orderId, tracking, courier)
            if (res.success) {
                toast.success("Fulfillment details updated")
            } else {
                toast.error(res.error)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col gap-3 p-4 bg-muted/20 rounded-xl border min-w-[300px]">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Order Lifecycle</span>
                <Select disabled={loading} onValueChange={onStatusChange} defaultValue={status}>
                    <SelectTrigger className="w-[180px] h-8 text-xs font-bold">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="PENDING" className="text-xs">Pending</SelectItem>
                        <SelectItem value="PAID" className="text-xs">Paid</SelectItem>
                        <SelectItem value="PACKED" className="text-xs">Packed</SelectItem>
                        <SelectItem value="SHIPPED" className="text-xs font-bold text-primary">Shipped</SelectItem>
                        <SelectItem value="OUT_FOR_DELIVERY" className="text-xs">Out for Delivery</SelectItem>
                        <SelectItem value="DELIVERED" className="text-xs font-bold text-success">Delivered</SelectItem>
                        <SelectItem value="CANCELLED" className="text-xs text-destructive">Cancelled</SelectItem>
                        <SelectItem value="RETURN_REQUESTED" className="text-xs italic">Return Requested</SelectItem>
                        <SelectItem value="RETURNED" className="text-xs underline">Returned</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Fulfillment Tracking</span>
                <div className="flex gap-2">
                    <Select disabled={loading} onValueChange={setCourier} defaultValue={courier}>
                        <SelectTrigger className="w-[120px] h-8 text-xs">
                            <SelectValue placeholder="Courier" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fedex" className="text-xs">FedEx</SelectItem>
                            <SelectItem value="dhl" className="text-xs">DHL</SelectItem>
                            <SelectItem value="ups" className="text-xs">UPS</SelectItem>
                            <SelectItem value="bluedart" className="text-xs">BlueDart</SelectItem>
                            <SelectItem value="delhivery" className="text-xs">Delhivery</SelectItem>
                            <SelectItem value="other" className="text-xs">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        className="flex-1 h-8 text-xs"
                        placeholder="Tracking Number"
                        value={tracking}
                        onChange={(e) => setTracking(e.target.value)}
                        disabled={loading}
                    />
                    <Button size="sm" className="h-8 px-3" onClick={onFulfillmentUpdate} disabled={loading}>
                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
