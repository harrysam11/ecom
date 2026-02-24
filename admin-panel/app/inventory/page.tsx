import { prisma } from "@/lib/prisma"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { format } from "date-fns"

export default async function InventoryPage() {
    const logs = await prisma.inventoryLog.findMany({
        orderBy: { createdAt: "desc" },
        include: { product: { select: { name: true } } }
    })

    const products = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            stock: true,
            lowStockThreshold: true,
        },
        orderBy: { stock: "asc" }
    })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl font-serif text-primary">Inventory</h1>
                <p className="text-sm text-muted-foreground">Manage stock levels and view audit history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-serif text-lg">Current Stock Levels</CardTitle>
                        <CardDescription>Monitor products requiring restock.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Stock</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((p) => (
                                    <TableRow key={p.id}>
                                        <TableCell className="font-medium text-sm">{p.name}</TableCell>
                                        <TableCell className="text-right">{p.stock}</TableCell>
                                        <TableCell className="text-right">
                                            {p.stock <= p.lowStockThreshold ? (
                                                <Badge variant="destructive">LOW STOCK</Badge>
                                            ) : (
                                                <Badge variant="success">IN STOCK</Badge>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="font-serif text-lg">Inventory Logs</CardTitle>
                        <CardDescription>Recent stock movements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead className="text-right">Change</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-xs">{format(log.createdAt, "MMM dd, HH:mm")}</TableCell>
                                        <TableCell className="text-sm">{log.product.name}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            <span className={log.change > 0 ? "text-success" : "text-destructive"}>
                                                {log.change > 0 ? `+${log.change}` : log.change}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {logs.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="h-24 text-center">
                                            No recent logs.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
