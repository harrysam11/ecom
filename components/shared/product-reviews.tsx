import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { FadeIn, StaggerContainer } from "./animation-wrapper"
import { prisma } from "@/lib/prisma"
import { format } from "date-fns"

interface ProductReviewsProps {
    productId: string
}

export default async function ProductReviews({ productId }: ProductReviewsProps) {
    const reviews = await prisma.review.findMany({
        where: {
            productId,
            status: "APPROVED"
        },
        include: {
            user: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    const totalReviews = reviews.length
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews).toFixed(1)
        : "0.0"

    const ratingDistribution = [5, 4, 3, 2, 1].map(rating => {
        const count = reviews.filter(r => r.rating === rating).length
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
        return { rating, count, percentage }
    })

    return (
        <StaggerContainer className="space-y-12">
            <FadeIn direction="up">
                <h3 className="text-3xl font-black tracking-tighter font-serif uppercase">Customer Reviews</h3>
            </FadeIn>
            <div className="grid gap-16 md:grid-cols-2">
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="text-4xl font-bold">{averageRating}</div>
                        <div className="space-y-1">
                            <div className="flex text-yellow-500">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={star <= Math.round(Number(averageRating)) ? "fill-current w-5 h-5" : "w-5 h-5 text-muted/20"}
                                    />
                                ))}
                            </div>
                            <div className="text-sm text-muted-foreground">Based on {totalReviews} reviews</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {ratingDistribution.map(({ rating, percentage }) => (
                            <div key={rating} className="flex items-center gap-4 text-sm">
                                <div className="w-12 text-muted-foreground">{rating} stars</div>
                                <Progress value={percentage} className="h-2" />
                                <div className="w-12 text-right text-muted-foreground">{Math.round(percentage)}%</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    {reviews.length === 0 ? (
                        <p className="text-muted-foreground italic font-light">No reviews yet for this product. Be the first to share your thoughts!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{review.user.name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{review.user.name || "Verified User"}</div>
                                        <div className="flex text-yellow-500 text-xs">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={star <= review.rating ? "fill-current w-3 h-3" : "w-3 h-3 text-muted/20"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="ml-auto text-xs text-muted-foreground">
                                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {review.comment}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </StaggerContainer>
    )
}
