import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export default async function GlobalOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: { select: { name: true, email: true } },
            store: { select: { name: true, subdomain: true } },
        },
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Global Orders</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders across all stores</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Store</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Platform Fee</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{order.store.name}</span>
                                            <span className="text-xs text-muted-foreground">{order.store.subdomain}.localhost</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span>{order.user.name || "Unknown"}</span>
                                            <span className="text-xs text-muted-foreground">{order.user.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">${Number(order.total).toFixed(2)}</TableCell>
                                    <TableCell className="text-emerald-600 font-semibold">+${Number(order.commissionFee).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge variant={order.status === "PAID" ? "default" : "secondary"}>
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{format(order.createdAt, "MMM dd, HH:mm")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
