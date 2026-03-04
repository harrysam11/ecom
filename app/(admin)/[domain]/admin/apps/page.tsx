import { prisma } from "@/lib/prisma"
import { getStoreOrThrow } from "@/lib/store"
import { AVAILABLE_PLUGINS } from "@/lib/plugins"
import { Blocks, CheckCircle2, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { togglePlugin } from "@/lib/admin-actions"
import { revalidatePath } from "next/cache"

export default async function AppsPage() {
    const store = await getStoreOrThrow()
    const activePlugins = store.activePlugins || []

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Apps & Extensions</h1>
                    <p className="text-muted-foreground">
                        Enhance your store with powerful plugins and third-party integrations.
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {AVAILABLE_PLUGINS.map((plugin) => {
                    const isActive = activePlugins.includes(plugin.id)

                    return (
                        <Card key={plugin.id} className="relative overflow-hidden">
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                    <Blocks className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl">{plugin.name}</CardTitle>
                                        {isActive && (
                                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
                                                Active
                                            </Badge>
                                        )}
                                    </div>
                                    <CardDescription className="text-xs uppercase tracking-wider font-semibold mt-1">
                                        {plugin.category}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {plugin.description}
                                </p>
                                <form action={async () => {
                                    "use server"
                                    await togglePlugin(plugin.id, !isActive)
                                }}>
                                    <Button
                                        variant={isActive ? "outline" : "default"}
                                        className="w-full"
                                    >
                                        {isActive ? "Deactivate" : "Activate"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Info className="h-5 w-5 text-primary" />
                    <div>
                        <CardTitle className="text-lg">Looking for more?</CardTitle>
                        <CardDescription>
                            Custom integrations and third-party developer support are coming soon to the platform.
                        </CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}
