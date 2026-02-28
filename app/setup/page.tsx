"use client"

import { useState } from "react"
import { createStore } from "@/lib/store-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Store, Globe, ArrowRight } from "lucide-react"
import { FadeIn } from "@/components/shared/animation-wrapper"
import { useSearchParams } from "next/navigation"

export default function SetupPage() {
    return (
        <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-secondary/10 p-4"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <SetupForm />
        </React.Suspense>
    )
}

function SetupForm() {
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [subdomain, setSubdomain] = useState("")

    const plan = searchParams.get("plan")
    const sessionId = searchParams.get("session_id")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData()
        formData.append("name", name)
        formData.append("subdomain", subdomain.toLowerCase().replace(/[^a-z0-9]/g, ""))
        if (plan) formData.append("plan", plan)
        if (sessionId) formData.append("sessionId", sessionId)

        const result = await createStore(formData)

        if (result.error) {
            toast.error(result.error)
            setLoading(false)
        } else {
            toast.success("Store created successfully!")
            // Redirect to the new store's admin panel
            const currentHost = window.location.host // "localhost:3000" or "ecom-saas.com"
            const protocol = window.location.protocol
            let newHost = `${result.subdomain}.${currentHost}`

            // If we are on localhost, ensure we don't double up or misplace it
            if (currentHost.includes("localhost")) {
                newHost = `${result.subdomain}.localhost:${currentHost.split(":")[1] || "3000"}`
            }

            window.location.href = `${protocol}//${newHost}/admin/login`
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/10 p-4">
            <FadeIn direction="up">
                <Card className="w-full max-w-lg border-black/5 shadow-2xl rounded-none">
                    <CardHeader className="space-y-4 text-center">
                        <div className="mx-auto w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white">
                            <Store className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-3xl font-black font-serif uppercase tracking-tighter">Setup Your Store</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Almost there! Give your empire a name and a unique address.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-8 py-8">
                            <div className="space-y-3">
                                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest opacity-60">Store Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Moonlight Boutique"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="h-14 rounded-none border-black/10 focus:border-black transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="subdomain" className="text-[10px] font-bold uppercase tracking-widest opacity-60">Subdomain</Label>
                                <div className="relative">
                                    <Input
                                        id="subdomain"
                                        placeholder="moonlight"
                                        value={subdomain}
                                        onChange={(e) => setSubdomain(e.target.value)}
                                        required
                                        className="h-14 rounded-none border-black/10 focus:border-black transition-all pr-[140px]"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-light">
                                        .ecom-saas.com
                                    </div>
                                </div>
                                <p className="text-[10px] text-muted-foreground italic">Only lowercase letters and numbers allowed.</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 rounded-none text-[11px] font-bold uppercase tracking-widest group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Building your empire...
                                    </>
                                ) : (
                                    <>
                                        Launch Store
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </FadeIn>
        </div>
    )
}
