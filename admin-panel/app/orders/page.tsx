import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"

export default async function OrdersPage() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true, email: true } },
            _count: { select: { items: true } }
        }
    })

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
            <div>
                <h1 className="text-lg font-semibold md:text-2xl font-serif text-primary">Orders</h1>
                <p className="text-sm text-muted-foreground">Manage customer orders and shipments.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Recent Orders</CardTitle>
                    <CardDescription>
                        A history of all orders in your store.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-medium">#{order.orderNumber.slice(-6).toUpperCase()}</TableCell>
                                    <TableCell>
                                        <div className="text-sm font-medium">{order.user.name || "N/A"}</div>
                                        <div className="text-xs text-muted-foreground">{order.user.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusMap[order.status] as any || "outline"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {format(order.createdAt, "MMM dd, yyyy")}
                                    </TableCell>
                                    <TableCell className="font-serif font-medium">
                                        ${Number(order.total).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/orders/${order.id}`}>Details</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
