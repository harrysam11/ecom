"use client"

import { FadeIn, StaggerContainer } from "./animation-wrapper"
import { Star } from "lucide-react"

const TESTIMONIALS = [
    {
        content: "The attention to detail and minimalist aesthetic matched exactly what I was looking for. Simply timeless.",
        author: "Alexander V.",
        role: "Architect",
    },
    {
        content: "An uncompromising commitment to quality and craft. The packaging alone felt like opening a piece of art.",
        author: "Elena M.",
        role: "Creative Director",
    },
    {
        content: "Rare to find this level of service in a digital-first world. Response was swift and deeply personal.",
        author: "Marcus J.",
        role: "Collector",
    },
]

export default function Testimonials() {
    return (
        <section className="py-32 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <FadeIn direction="up" className="text-center mb-20">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/60 mb-6 block">Voices of Craft</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter font-serif uppercase">What they say</h2>
                </FadeIn>

                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-16">
                    {TESTIMONIALS.map((t, i) => (
                        <FadeIn key={i} direction="up" delay={i * 0.2}>
                            <div className="flex flex-col space-y-8">
                                <div className="flex text-black/20 gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-current" />
                                    ))}
                                </div>
                                <blockquote className="text-xl font-light italic leading-relaxed text-black/80">
                                    &ldquo;{t.content}&rdquo;
                                </blockquote>
                                <div className="pt-4 border-t border-black/5">
                                    <p className="text-xs font-bold uppercase tracking-[0.2em]">{t.author}</p>
                                    <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground mt-1">{t.role}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}
