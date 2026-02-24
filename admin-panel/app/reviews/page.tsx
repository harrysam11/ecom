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
import { Star } from "lucide-react"

export default async function ReviewsPage() {
    const reviews = await prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true } },
            product: { select: { name: true } }
        }
    })

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-lg font-semibold md:text-2xl text-primary">Reviews</h1>
                <p className="text-sm text-muted-foreground">Moderate customer feedback and ratings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">All Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Product</TableHead>
                                <TableHead>Rating</TableHead>
                                <TableHead>Comment</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reviews.map((review) => (
                                <TableRow key={review.id}>
                                    <TableCell className="font-medium">{review.user.name}</TableCell>
                                    <TableCell>{review.product.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            {review.rating}
                                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate italic">"{review.comment}"</TableCell>
                                    <TableCell>
                                        <Badge variant={review.status === "APPROVED" ? "success" : review.status === "PENDING" ? "secondary" : "destructive" as any}>
                                            {review.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant="outline" className="cursor-pointer hover:bg-muted transition-colors">Moderate</Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {reviews.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No reviews found.
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
