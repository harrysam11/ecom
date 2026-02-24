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
import { format } from "date-fns"

export default async function PaymentsPage() {
    const payments = await prisma.payment.findMany({
        orderBy: { createdAt: "desc" },
        include: { order: { select: { orderNumber: true } } }
    })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl font-serif text-primary">Payments</h1>
                <p className="text-sm text-muted-foreground">Monitor and manage all customer transactions.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Transaction History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Method</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell className="text-sm">{format(payment.createdAt, "MMM dd, yyyy HH:mm")}</TableCell>
                                    <TableCell>#{payment.order.orderNumber.slice(-6).toUpperCase()}</TableCell>
                                    <TableCell className="text-xs uppercase font-mono">{payment.paymentMethod || "N/A"}</TableCell>
                                    <TableCell>
                                        <Badge variant={payment.status === "PAID" ? "success" : "destructive" as any}>
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-serif font-bold">
                                        ${Number(payment.amount).toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {payments.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No payments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
