import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { FileText } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { OrderStatusManager } from "@/components/admin/order-status-manager"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            items: {
                include: { product: true }
            },
            address: true
        }
    })

    if (!order) notFound()

    const statusMap: Record<string, string> = {
        PENDING: "secondary",
        PROCESSING: "outline",
        SHIPPED: "default",
        DELIVERED: "success",
        CANCELLED: "destructive",
        REFUNDED: "outline",
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-serif tracking-tight">Order #{order.orderNumber.slice(-6).toUpperCase()}</h1>
                    <p className="text-sm text-muted-foreground">Placed on {format(order.createdAt, "MMMM dd, yyyy 'at' hh:mm a")}</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-2">
                        <Badge variant={statusMap[order.status] as any || "outline"}>{order.status}</Badge>
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <Link href={`/orders/${order.id}/invoice`} target="_blank">
                                <FileText className="h-4 w-4" />
                                Invoice
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2" asChild>
                            <Link href={`/orders/${order.id}/packing-slip`} target="_blank">
                                <FileText className="h-4 w-4 text-primary" />
                                Packing Slip
                            </Link>
                        </Button>
                    </div>
                    <OrderStatusManager
                        orderId={order.id}
                        status={order.status}
                        trackingNumber={order.trackingNumber || ""}
                        courierName={order.courierName || ""}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-serif">Order Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {order.items.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <div className="font-medium">{item.product.name}</div>
                                            </TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                                            <TableCell className="text-right">${(Number(item.price) * item.quantity).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <div className="mt-4 space-y-2 text-right">
                                <div className="flex justify-end gap-10">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">${Number(order.total).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-end gap-10">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="font-medium">$0.00</span>
                                </div>
                                <div className="flex justify-end gap-10 text-lg">
                                    <span className="font-bold">Total</span>
                                    <span className="font-bold font-serif">${Number(order.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-serif">Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div>
                                <span className="font-medium">Name:</span> {order.user.name}
                            </div>
                            <div>
                                <span className="font-medium">Email:</span> {order.user.email}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="font-serif">Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1 text-sm">
                            <p>{order.address?.street}</p>
                            <p>{order.address?.city}, {order.address?.state} {order.address?.zip}</p>
                            <p>{order.address?.country}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
