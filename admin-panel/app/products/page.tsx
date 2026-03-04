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

export default async function GlobalProductsPage() {
    const products = await prisma.product.findMany({
        include: {
            store: { select: { name: true, subdomain: true } },
            category: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Global Inventory</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Products across the platform</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Store</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Added</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            {product.images[0] && (
                                                <img src={product.images[0]} className="h-8 w-8 rounded object-cover" />
                                            )}
                                            <span className="font-medium">{product.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs">{product.store.name}</span>
                                    </TableCell>
                                    <TableCell>{product.category?.name || "Uncategorized"}</TableCell>
                                    <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                                    <TableCell>
                                        <span className={product.stock <= 5 ? "text-destructive font-bold" : ""}>
                                            {product.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={product.status === "PUBLISHED" ? "default" : "secondary"}>
                                            {product.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{format(product.createdAt, "MMM dd, yyyy")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
