"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FadeIn } from "./animation-wrapper"

export default function Newsletter() {
    return (
        <section className="py-24 border-t border-b border-black/5 bg-white">
            <div className="container mx-auto px-4 max-w-[800px] text-center">
                <FadeIn direction="up">
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary/60 mb-6 block">Stay Inspired</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter font-serif uppercase mb-6">Join the Collective</h2>
                    <p className="text-lg font-light text-muted-foreground mb-12 max-w-[600px] mx-auto leading-relaxed">
                        Receive early access to limited editions, exclusive kurations, and a manifesto on modern design.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 items-center justify-center" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            placeholder="Email Address"
                            type="email"
                            className="h-14 rounded-none border-black/10 focus-visible:ring-black px-6 text-base tracking-wide bg-secondary/20"
                            required
                        />
                        <Button type="submit" size="lg" className="h-14 px-10 rounded-none bg-black text-white hover:bg-black/90 transition-all font-bold tracking-[0.2em] w-full sm:w-auto">
                            SUBSCRIBE
                        </Button>
                    </form>
                    <p className="mt-8 text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                        By subscribing, you agree to our <a href="#" className="underline underline-offset-4 decoration-1 hover:text-black">Privacy Policy</a>
                    </p>
                </FadeIn>
            </div>
        </section>
    )
}
