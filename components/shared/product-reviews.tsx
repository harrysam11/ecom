import { Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { FadeIn, StaggerContainer } from "./animation-wrapper"

export default function ProductReviews() {
    return (
        <StaggerContainer className="space-y-12">
            <FadeIn direction="up">
                <h3 className="text-3xl font-black tracking-tighter font-serif uppercase">Customer Reviews</h3>
            </FadeIn>
            <div className="grid gap-16 md:grid-cols-2">
                <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                        <div className="text-4xl font-bold">4.9</div>
                        <div className="space-y-1">
                            <div className="flex text-yellow-500">
                                <Star className="fill-current w-5 h-5" />
                                <Star className="fill-current w-5 h-5" />
                                <Star className="fill-current w-5 h-5" />
                                <Star className="fill-current w-5 h-5" />
                                <Star className="fill-current w-5 h-5" />
                            </div>
                            <div className="text-sm text-muted-foreground">Based on 128 reviews</div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-4 text-sm">
                                <div className="w-12 text-muted-foreground">{rating} stars</div>
                                <Progress value={rating === 5 ? 85 : rating === 4 ? 10 : 5} className="h-2" />
                                <div className="w-12 text-right text-muted-foreground">{rating === 5 ? "85%" : rating === 4 ? "10%" : "5%"}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>U{i}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold">Verified User</div>
                                    <div className="flex text-yellow-500 text-xs">
                                        <Star className="fill-current w-3 h-3" />
                                        <Star className="fill-current w-3 h-3" />
                                        <Star className="fill-current w-3 h-3" />
                                        <Star className="fill-current w-3 h-3" />
                                        <Star className="fill-current w-3 h-3" />
                                    </div>
                                </div>
                                <div className="ml-auto text-xs text-muted-foreground">2 days ago</div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Extremely happy with this purchase. The quality is top-notch and it arrived faster than expected. Highly recommended!
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </StaggerContainer>
    )
}
