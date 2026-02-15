"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { FadeIn, StaggerContainer } from "./animation-wrapper"
import { motion } from "framer-motion"

export default function Hero() {
    return (
        <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden bg-white text-black">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
                    alt="Premium Lifestyle"
                    fill
                    className="object-cover opacity-20"
                    priority
                    sizes="100vw"
                />
            </div>

            <div className="container relative z-10 flex flex-col items-center text-center px-4">
                <StaggerContainer delayChildren={0.2} staggerChildren={0.2}>
                    <FadeIn direction="up">
                        <span className="mb-4 inline-block text-sm font-semibold uppercase tracking-[0.3em] text-primary/60">
                            The New Standard
                        </span>
                    </FadeIn>
                    <FadeIn direction="up">
                        <h1 className="mb-6 text-5xl font-bold tracking-tighter sm:text-6xl md:text-7xl lg:text-9xl font-serif">
                            TIMLESS <br /> ELEGANCE
                        </h1>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.4}>
                        <p className="mb-10 max-w-[700px] text-lg sm:text-2xl text-muted-foreground font-light leading-relaxed">
                            Discover our new collection of premium accessories designed for the modern individual, blending heritage with innovation.
                        </p>
                    </FadeIn>
                    <FadeIn direction="up" delay={0.6}>
                        <div className="flex flex-col gap-4 sm:flex-row justify-center">
                            <Link href="/products">
                                <Button size="lg" className="h-14 px-12 text-sm rounded-none bg-black text-white hover:bg-black/90 transition-all tracking-[0.2em] font-medium border-none shadow-xl">
                                    SHOP NOW
                                </Button>
                            </Link>
                            <Link href="/categories">
                                <Button variant="outline" size="lg" className="h-14 px-12 text-sm rounded-none border-black hover:bg-black hover:text-white transition-all tracking-[0.2em] font-medium bg-transparent">
                                    VIEW COLLECTION
                                </Button>
                            </Link>
                        </div>
                    </FadeIn>
                </StaggerContainer>
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block">
                <FadeIn direction="down" delay={1.2}>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Scroll</span>
                        <div className="w-[1px] h-12 bg-black/10 relative overflow-hidden">
                            <motion.div
                                className="absolute top-0 left-0 w-full h-full bg-blackOrigin"
                                animate={{ y: ["-100%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
