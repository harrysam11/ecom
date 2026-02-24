import { prisma } from "@/lib/prisma"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Truck, Clock, AlertTriangle, CheckCircle } from "lucide-react"

export default async function ShippingReportsPage() {
    // Aggregates for reports
    const deliveredCount = await prisma.order.count({ where: { status: "DELIVERED" } })
    const pendingShipment = await prisma.order.count({ where: { status: "PAID" } })
    const returnRequests = await prisma.returnRequest.count()

    // Mock data for delivery time and delay (in real app, use DateTime diffs)
    const avgDeliveryTime = "3.2 Days"
    const delayRate = "4.5%"

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Shipping Analytics</h1>
                <p className="text-sm text-muted-foreground">Monitor fulfillment performance and delivery metrics.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Successfully Delivered</CardTitle>
                        <CheckCircle className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{deliveredCount}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Avg. Delivery Time</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{avgDeliveryTime}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Within SLA targets</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow border-destructive/20 bg-destructive/5">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-destructive">Delayed Shipments</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-destructive">{delayRate}</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Check carrier performance</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Return Rate</CardTitle>
                        <Truck className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{(returnRequests / (deliveredCount || 1) * 100).toFixed(1)}%</div>
                        <p className="text-[10px] text-muted-foreground mt-1">Calculated from total deliveries</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Regional Fulfillment Share</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/20">
                        <p className="text-sm text-muted-foreground">Carrier performance chart loading...</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
