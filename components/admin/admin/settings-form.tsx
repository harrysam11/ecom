"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateSettings } from "@/lib/admin-actions"

interface SettingsFormProps {
    initialData: any
}

export function SettingsForm({ initialData }: SettingsFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [formData, setFormData] = useState(initialData || {})

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const values = Object.fromEntries(data.entries())

        startTransition(async () => {
            const result = await updateSettings(values)
            if (result.success) {
                toast.success("Settings updated successfully")
                router.refresh()
            } else {
                toast.error(result.error || "Failed to update settings")
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-medium">Store Configuration</h1>
                    <p className="text-sm text-muted-foreground">Manage your store's public information and settings.</p>
                </div>
                <Button type="submit" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                        <CardDescription>Public store details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="siteName">Site Name</Label>
                            <Input
                                id="siteName"
                                name="siteName"
                                defaultValue={formData.siteName}
                                placeholder="My Awesome Store"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="companyName">Legal Company Name</Label>
                            <Input
                                id="companyName"
                                name="companyName"
                                defaultValue={formData.companyName}
                                placeholder="Awesome Enterprise LLC"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
                            <Input
                                id="taxPercentage"
                                name="taxPercentage"
                                type="number"
                                step="0.01"
                                defaultValue={formData.taxPercentage}
                                placeholder="5.00"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Contact Details</CardTitle>
                        <CardDescription>Address and contact info for invoices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Support Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                defaultValue={formData.email}
                                placeholder="support@example.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                defaultValue={formData.phone}
                                placeholder="+1 234 567 890"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Business Address</Label>
                            <Textarea
                                id="address"
                                name="address"
                                defaultValue={formData.address}
                                placeholder="123 Street Name, City, State, ZIP"
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>SEO & Branding</CardTitle>
                        <CardDescription>Customization for search engines and generated invoices.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="metaTitle">SEO Site Title</Label>
                                <Input
                                    id="metaTitle"
                                    name="metaTitle"
                                    defaultValue={formData.metaTitle}
                                    placeholder="Site title for search engines"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="metaDescription">SEO Meta Description</Label>
                                <Textarea
                                    id="metaDescription"
                                    name="metaDescription"
                                    defaultValue={formData.metaDescription}
                                    placeholder="Site description for search results"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="footerText">Invoice Footer Text</Label>
                            <Textarea
                                id="footerText"
                                name="footerText"
                                defaultValue={formData.footerText}
                                placeholder="Thank you for your business!"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}
