import Link from "next/link"
import { PlusCircle, Search, Ticket } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"

export default async function CouponsPage() {
    const coupons = await prisma.coupon.findMany({
        orderBy: { createdAt: "desc" }
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl font-serif text-primary flex items-center gap-2">
                        <Ticket className="h-6 w-6" />
                        Coupons
                    </h1>
                    <p className="text-sm text-muted-foreground">Manage discount codes and promotions.</p>
                </div>
                <Button size="sm" className="h-7 gap-1" asChild>
                    <Link href="/coupons/new">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Create Coupon</span>
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">Active Coupons</CardTitle>
                    <CardDescription>
                        A list of promotional codes for your customers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Usage</TableHead>
                                <TableHead>Expires</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {coupons.map((coupon) => (
                                <TableRow key={coupon.id}>
                                    <TableCell className="font-bold font-mono">{coupon.code}</TableCell>
                                    <TableCell>{coupon.discountType}</TableCell>
                                    <TableCell>
                                        {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `$${Number(coupon.discountValue).toFixed(2)}`}
                                    </TableCell>
                                    <TableCell>{coupon.usageCount} / {coupon.usageLimit || "∞"}</TableCell>
                                    <TableCell>{format(coupon.expiresAt, "MMM dd, yyyy")}</TableCell>
                                    <TableCell>
                                        <Badge variant={coupon.isActive ? "success" : "destructive" as any}>
                                            {coupon.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/coupons/${coupon.id}`}>Edit</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {coupons.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-24 text-center">
                                        No coupons found.
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
