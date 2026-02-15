"use client"

import { Truck, ShieldCheck, RefreshCcw, CreditCard } from "lucide-react"
import { FadeIn, StaggerContainer } from "./animation-wrapper"

const BADGES = [
    {
        icon: Truck,
        title: "Express Delivery",
        description: "Complimentary global shipping on orders over $150.",
    },
    {
        icon: ShieldCheck,
        title: "Secure Payment",
        description: "Fully encrypted transaction processing for total peace of mind.",
    },
    {
        icon: RefreshCcw,
        title: "Curated Return",
        description: "30-day effortless returns for any unworn artifacts.",
    },
    {
        icon: CreditCard,
        title: "Premium Support",
        description: "Dedicated concierge service available 24/7.",
    },
]

export default function TrustBadges() {
    return (
        <section className="py-20 bg-secondary/30">
            <div className="container mx-auto px-4">
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {BADGES.map((badge, index) => (
                        <FadeIn key={index} direction="up" delay={index * 0.1}>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white border border-black/5 shadow-sm">
                                    <badge.icon className="h-6 w-6 stroke-[1.5]" />
                                </div>
                                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">{badge.title}</h3>
                                <p className="text-sm font-light text-muted-foreground max-w-[200px]">
                                    {badge.description}
                                </p>
                            </div>
                        </FadeIn>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}
