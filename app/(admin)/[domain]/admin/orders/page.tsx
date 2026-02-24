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
import { Badge } from "@/components/ui/badge"

const orders = [
    {
        id: "ORD-001",
        customer: "Olivia Martin",
        email: "olivia.martin@email.com",
        status: "Paid",
        total: "$250.00",
        date: "2023-06-23",
    },
    {
        id: "ORD-002",
        customer: "Jackson Lee",
        email: "jackson.lee@email.com",
        status: "Processing",
        total: "$39.00",
        date: "2023-06-24",
    },
    {
        id: "ORD-003",
        customer: "Isabella Nguyen",
        email: "isabella.nguyen@email.com",
        status: "Shipped",
        total: "$299.00",
        date: "2023-06-25",
    },
    {
        id: "ORD-004",
        customer: "William Kim",
        email: "will@email.com",
        status: "Paid",
        total: "$99.00",
        date: "2023-06-26",
    },
    {
        id: "ORD-005",
        customer: "Sofia Davis",
        email: "sofia.davis@email.com",
        status: "Paid",
        total: "$139.00",
        date: "2023-06-27",
    },
]

export default function OrdersPage() {
    return (
        <Card>
            <CardHeader className="px-7">
                <CardTitle>Orders</CardTitle>
                <CardDescription>Recent orders from your store.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order</TableHead>
                            <TableHead className="hidden sm:table-cell">Customer</TableHead>
                            <TableHead className="hidden sm:table-cell">Status</TableHead>
                            <TableHead className="hidden md:table-cell">Date</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>
                                    <div className="font-medium">{order.id}</div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <div className="font-medium">{order.customer}</div>
                                    <div className="hidden text-sm text-muted-foreground md:inline">
                                        {order.email}
                                    </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                    <Badge className="text-xs" variant="secondary">
                                        {order.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{order.date}</TableCell>
                                <TableCell className="text-right">{order.total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
