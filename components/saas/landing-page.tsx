"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FadeIn, StaggerContainer } from "@/components/shared/animation-wrapper"
import { CheckCircle2, Store, Rocket, Palette, Globe, CreditCard, Loader2, Menu, X } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function SaasLandingPage() {
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const handleSubscribe = async (priceId: string) => {
        // Option A: Simulated Checkout
        // Bypassing Stripe to allow instant testing of the store creation flow.
        if (priceId === "price_free_placeholder") {
            window.location.href = "/setup?plan=FREE"
            return
        }

        if (priceId === "price_pro_placeholder") {
            window.location.href = "/setup?plan=PRO"
            return
        }

        if (priceId === "price_premium_placeholder") {
            window.location.href = "/setup?plan=PREMIUM"
            return
        }
    }


}

return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans">
        {/* Nav */}
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter uppercase font-serif">ECOM SAAS</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest">
                    <Link href="#features" className="hover:opacity-50 transition-opacity">Features</Link>
                    <Link href="#pricing" className="hover:opacity-50 transition-opacity">Pricing</Link>
                    <Link href="/login" className="hover:opacity-50 transition-opacity">Login</Link>
                    <Link href="#pricing">
                        <Button className="rounded-none px-8 py-6 h-auto text-[11px] uppercase tracking-widest font-bold">Start Trial</Button>
                    </Link>
                </nav>
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-black/5 shadow-lg p-6 flex flex-col gap-6 text-[11px] font-bold uppercase tracking-widest">
                    <Link href="#features" onClick={() => setMobileMenuOpen(false)}>Features</Link>
                    <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    <Link href="#pricing" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="rounded-none h-12 w-full text-[11px] uppercase tracking-widest font-bold">Start Trial</Button>
                    </Link>
                </div>
            )}
        </header>

        <main>
            {/* Hero */}
            <section className="pt-40 pb-32 px-6">
                <div className="container mx-auto text-center max-w-4xl">
                    <StaggerContainer>
                        <FadeIn direction="up">
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-6 inline-block">
                                The Future of Commerce
                            </span>
                        </FadeIn>
                        <FadeIn direction="up">
                            <h1 className="text-6xl md:text-8xl font-black tracking-tighter font-serif uppercase leading-[0.9] mb-8">
                                Launch Your <br /> Empire in Minutes
                            </h1>
                        </FadeIn>
                        <FadeIn direction="up">
                            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-12">
                                Everything you need to sell online. Premium designs, powerful management, and seamless payments. All in one place.
                            </p>
                        </FadeIn>
                        <FadeIn direction="up">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="#pricing">
                                    <Button size="lg" className="h-16 px-12 text-[11px] font-bold uppercase tracking-widest rounded-none shadow-2xl">
                                        Create Your Store
                                    </Button>
                                </Link>
                                <Link href="#features">
                                    <Button size="lg" variant="outline" className="h-16 px-12 text-[11px] font-bold uppercase tracking-widest rounded-none border-black">
                                        View Features
                                    </Button>
                                </Link>
                            </div>
                        </FadeIn>
                    </StaggerContainer>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-32 bg-secondary/30">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mb-4 inline-block">Features</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter font-serif uppercase">Built for Performance</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Instant Setup", desc: "Get your custom subdomain and store live instantly.", icon: Rocket },
                            { title: "Custom Design", desc: "Professional themes that reflect your unique brand identity.", icon: Palette },
                            { title: "Global Payments", desc: "Integrate Stripe, PayPal, and more with a few clicks.", icon: CreditCard },
                            { title: "Analytics", desc: "Deep insights into your customers and sales performance.", icon: Globe },
                            { title: "Inventory", desc: "Manage thousands of products with ease.", icon: Store },
                            { title: "Growth Tools", desc: "SEO, newsletters, and marketing tools built-in.", icon: CheckCircle2 },
                        ].map((f, i) => (
                            <FadeIn key={i} direction="up" delay={i * 0.1} className="p-8 border border-black/5 bg-white shadow-sm hover:shadow-xl transition-all group">
                                <f.icon className="w-10 h-10 mb-6 group-hover:scale-110 transition-transform" />
                                <h3 className="text-xl font-bold uppercase tracking-tight mb-4 font-serif">{f.title}</h3>
                                <p className="text-muted-foreground font-light leading-relaxed">{f.desc}</p>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-32">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter font-serif uppercase">Simple Pricing</h2>
                        <p className="text-muted-foreground mt-4">Grow your business without the complexity.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            { name: "Starter", price: "0", features: ["10 Products Limit", "1% Transaction Fee", "Ecom Subdomain", "Powered By Branding"] },
                            { name: "Pro", price: "19", features: ["Unlimited Products", "0.5% Transaction Fee", "Custom Domain Support", "Remove Branding"], featured: true },
                            { name: "Premium", price: "49", features: ["Unlimited Products", "0% Transaction Fee", "Priority Support", "Basic Analytics", "AI Chatbot & Builder"] },
                        ].map((p, i) => (
                            <div key={i} className={`p-12 border ${p.featured ? 'border-black border-2 scale-105 shadow-2xl z-10' : 'border-black/5'} flex flex-col`}>
                                <h3 className="text-2xl font-bold uppercase tracking-tighter font-serif mb-2">{p.name}</h3>
                                <div className="mb-8 flex items-baseline">
                                    <span className="text-4xl font-bold">${p.price}</span>
                                    <span className="text-muted-foreground ml-2">/month</span>
                                </div>
                                <ul className="space-y-4 mb-12 flex-1">
                                    {p.features.map((f, j) => (
                                        <li key={j} className="flex items-center gap-3 text-sm font-light">
                                            <CheckCircle2 className="w-4 h-4" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant={p.featured ? "default" : "outline"}
                                    className="w-full rounded-none h-14 text-[11px] font-bold uppercase tracking-widest"
                                    onClick={() => handleSubscribe(
                                        p.name === "Starter" ? "price_free_placeholder" :
                                            p.name === "Pro" ? "price_pro_placeholder" :
                                                "price_premium_placeholder"
                                    )}
                                    disabled={loadingPlan !== null}
                                >
                                    {loadingPlan === (p.name === "Starter" ? "price_free_placeholder" : p.name === "Pro" ? "price_pro_placeholder" : "price_premium_placeholder") ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        p.price === "0" ? "Start Free" : "Get Started"
                                    )}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>

        <footer className="py-20 border-t border-black/5 bg-secondary/10">
            <div className="container mx-auto px-6 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40">
                    &copy; 2026 Ecom SaaS Platform. Built for the modern entrepreneur.
                </p>
            </div>
        </footer>
    </div>
)
}
