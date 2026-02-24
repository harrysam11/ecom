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
import { Button } from "@/components/ui/button"

export default async function ReturnRequestsPage() {
    const requests = await prisma.returnRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            order: {
                select: {
                    orderNumber: true,
                    user: { select: { name: true } }
                }
            }
        }
    })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl text-primary">Return Requests</h1>
                <p className="text-sm text-muted-foreground">Moderate customer returns and process refunds.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Active Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell className="text-sm">{format(request.createdAt, "MMM dd, yyyy")}</TableCell>
                                    <TableCell>#{request.order.orderNumber.slice(-6).toUpperCase()}</TableCell>
                                    <TableCell>{request.order.user.name}</TableCell>
                                    <TableCell className="max-w-[200px] truncate italic">"{request.reason}"</TableCell>
                                    <TableCell>
                                        <Badge variant={request.status === "APPROVED" ? "success" : request.status === "PENDING" ? "secondary" : "destructive" as any}>
                                            {request.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">Manage</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {requests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No return requests found.
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
