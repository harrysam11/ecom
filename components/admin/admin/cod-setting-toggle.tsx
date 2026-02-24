"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { updateCODSettings } from "@/lib/admin-actions"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function CODSettingToggle({ isEnabled }: { isEnabled: boolean }) {
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(isEnabled)

    async function onToggle(val: boolean) {
        setLoading(true)
        try {
            const res = await updateCODSettings(val)
            if (res.success) {
                setChecked(val)
                toast.success(val ? "COD Enabled" : "COD Disabled")
            } else {
                toast.error(res.error)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center space-x-2 border px-3 py-1.5 rounded-lg bg-muted/50">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <Switch
                    id="cod-mode"
                    checked={checked}
                    onCheckedChange={onToggle}
                    disabled={loading}
                />
            )}
            <Label htmlFor="cod-mode" className="text-xs font-bold cursor-pointer">COD</Label>
        </div>
    )
}
