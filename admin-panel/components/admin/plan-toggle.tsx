"use client"

import { useState } from "react"
import { updateStorePlan } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Loader2, ChevronDown } from "lucide-react"
import { toast } from "sonner"

interface PlanToggleProps {
    storeId: string
    currentPlan: string
}

export function PlanToggle({ storeId, currentPlan }: PlanToggleProps) {
    const [isPending, setIsPending] = useState(false)

    const onUpdate = async (plan: "FREE" | "PRO" | "PREMIUM") => {
        if (plan === currentPlan) return

        setIsPending(true)
        try {
            const result = await updateStorePlan(storeId, plan)
            if (result.success) {
                toast.success(`Plan updated to ${plan}`)
            } else {
                toast.error(result.error || "Failed to update plan")
            }
        } catch (error) {
            toast.error("An error occurred")
        } finally {
            setIsPending(false)
        }
    }

    const getBadgeVariant = (plan: string) => {
        switch (plan) {
            case "PREMIUM": return "default"
            case "PRO": return "secondary"
            default: return "outline"
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isPending}>
                <Button variant="ghost" size="sm" className="h-8 flex gap-2">
                    {isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        <Badge variant={getBadgeVariant(currentPlan)}>
                            {currentPlan}
                        </Badge>
                    )}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onUpdate("FREE")}>
                    FREE
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate("PRO")}>
                    PRO
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onUpdate("PREMIUM")}>
                    PREMIUM
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
