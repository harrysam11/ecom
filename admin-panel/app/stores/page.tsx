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
import { PlanToggle } from "@/components/admin/plan-toggle"

export const dynamic = 'force-dynamic'

export default async function StoresPage() {
    const stores = await prisma.store.findMany({
        include: {
            _count: {
                select: {
                    products: true,
                    orders: true,
                    storeUsers: true
                }
            }
        },
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Manage Stores</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Stores</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Store Name</TableHead>
                                <TableHead>Subdomain</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Staff</TableHead>
                                <TableHead>Created At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stores.map((store) => (
                                <TableRow key={store.id}>
                                    <TableCell className="font-medium">{store.name}</TableCell>
                                    <TableCell>{store.subdomain}.localhost</TableCell>
                                    <TableCell>
                                        <PlanToggle storeId={store.id} currentPlan={store.plan} />
                                    </TableCell>
                                    <TableCell>{store._count.products}</TableCell>
                                    <TableCell>{store._count.orders}</TableCell>
                                    <TableCell>{store._count.storeUsers}</TableCell>
                                    <TableCell>{format(store.createdAt, "MMM dd, yyyy")}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
