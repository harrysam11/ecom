import { prisma } from "@/lib/prisma"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Truck, Plus, Trash2, Globe } from "lucide-react"
import { ShippingZoneForm } from "@/components/admin/shipping-zone-form"
import { ShippingRateForm } from "@/components/admin/shipping-rate-form"
import { CODSettingToggle } from "@/components/admin/cod-setting-toggle"

export default async function ShippingSettingsPage() {
    const zones = await prisma.shippingZone.findMany({
        include: { rates: true },
        orderBy: { createdAt: "desc" }
    })

    const settings = await prisma.settings.findUnique({
        where: { id: "site-settings" }
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                        <Truck className="h-6 w-6" />
                        Shipping Configuration
                    </h1>
                    <p className="text-sm text-muted-foreground">Manage shipping zones, rates, and delivery options.</p>
                </div>
                <div className="flex gap-2">
                    <CODSettingToggle isEnabled={settings?.isCODEnabled ?? true} />
                    <ShippingZoneForm />
                </div>
            </div>

            <div className="grid gap-6">
                {zones.map((zone) => (
                    <Card key={zone.id}>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-primary" />
                                    {zone.name}
                                </CardTitle>
                                <CardDescription>
                                    {zone.countries.join(", ")} {zone.states.length > 0 && `(${zone.states.join(", ")})`}
                                </CardDescription>
                            </div>
                            <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Shipping Rates</h3>
                                    <ShippingRateForm zoneId={zone.id} />
                                </div>
                                <div className="grid gap-4">
                                    {zone.rates.map((rate) => (
                                        <div key={rate.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                                            <div>
                                                <div className="text-sm font-bold">${Number(rate.flatPrice).toFixed(2)}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {Number(rate.minWeight)}kg - {rate.maxWeight ? `${Number(rate.maxWeight)}kg` : "∞"} • {rate.estimatedDays || "No estimate"}
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ))}
                                    {zone.rates.length === 0 && (
                                        <div className="text-center py-4 text-sm text-muted-foreground border-dashed border-2 rounded-lg">
                                            No rates defined for this zone.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {zones.length === 0 && (
                    <div className="text-center py-12 bg-muted/20 border-2 border-dashed rounded-xl">
                        <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">No Shipping Zones</h3>
                        <p className="text-sm text-muted-foreground mb-6">Create your first shipping zone to start selling.</p>
                        <ShippingZoneForm />
                    </div>
                )}
            </div>
        </div>
    )
}
