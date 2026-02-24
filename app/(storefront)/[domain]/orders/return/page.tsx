"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

export default function ReturnRequestPage() {
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setSubmitted(true)
            toast.success("Return request submitted successfully")
        }, 1500)
    }

    if (submitted) {
        return (
            <div className="container mx-auto px-4 py-24 text-center max-w-md">
                <div className="bg-success/10 text-success p-6 rounded-full inline-block mb-6">
                    <Send className="h-12 w-12" />
                </div>
                <h1 className="text-3xl font-serif font-bold mb-4">Request Submitted</h1>
                <p className="text-muted-foreground mb-8">
                    Your return request for order #ORD-123 has been received. Our team will review it and notify you via email within 48 hours.
                </p>
                <Button asChild>
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl min-h-screen">
            <Link href="/orders" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
                <ArrowLeft className="h-4 w-4" /> Back to My Orders
            </Link>

            <div className="mb-10">
                <h1 className="text-4xl font-serif font-bold tracking-tight mb-2">Request a Return</h1>
                <p className="text-muted-foreground">Tell us why you'd like to return your items.</p>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-serif">Order #ORD-123456</CardTitle>
                    <CardDescription>Purchased on October 12, 2026</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Return</Label>
                            <Select required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="wrong_size">Wrong Size / Fit</SelectItem>
                                    <SelectItem value="damaged">Damaged or Defective</SelectItem>
                                    <SelectItem value="not_as_described">Item not as described</SelectItem>
                                    <SelectItem value="changed_mind">Changed my mind</SelectItem>
                                    <SelectItem value="late">Arrived too late</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="details">Additional Details</Label>
                            <Textarea
                                id="details"
                                placeholder="Explain the issue in detail..."
                                className="min-h-[120px]"
                                required
                            />
                        </div>

                        <div className="bg-muted/30 p-4 rounded-lg text-xs space-y-2 border border-dashed">
                            <p className="font-bold uppercase tracking-widest text-muted-foreground">Return Policy</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Items must be unworn and in original packaging.</li>
                                <li>Refunds are processed within 5-7 business days of receipt.</li>
                                <li>Return shipping labels will be provided if approved.</li>
                            </ul>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full gap-2">
                            {loading ? "Submitting..." : "Submit Return Request"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
