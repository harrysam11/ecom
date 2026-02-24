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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function CustomersPage() {
    const customers = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { orders: true } } }
    })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl text-primary">Customers</h1>
                <p className="text-sm text-muted-foreground">Manage your customer base and view their activity.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Customer Directory</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Orders</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="flex items-center gap-3 py-4">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={customer.image || ""} />
                                            <AvatarFallback>{customer.name?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{customer.name || "N/A"}</div>
                                            <div className="text-xs text-muted-foreground">{customer.email}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{customer.role}</Badge>
                                    </TableCell>
                                    <TableCell>{customer._count.orders}</TableCell>
                                    <TableCell className="text-sm">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">Details</Badge>
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
