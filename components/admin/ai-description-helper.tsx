"use client"

import { useState } from "react"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AIDescriptionHelperProps {
    productName: string
    onGenerated: (description: string) => void
}

export function AIDescriptionHelper({ productName, onGenerated }: AIDescriptionHelperProps) {
    const [isGenerating, setIsGenerating] = useState(false)

    const generateDescription = async () => {
        if (!productName) {
            toast.error("Please enter a product name first")
            return
        }

        setIsGenerating(true)

        // Simulation of AI generation
        // In a real app, this would call an API route using OPENAI_API_KEY
        setTimeout(() => {
            const descriptions = [
                `Experience ultimate comfort and style with our new ${productName}. Crafted with premium materials for a luxurious feel that lasts all day.`,
                `Elevate your daily routine with the ${productName}. Sleek, modern design meets exceptional performance in this must-have addition to your collection.`,
                `The ${productName} combines classic aesthetics with modern technology. Perfect for those who demand both form and function without compromise.`
            ]

            const randomDesc = descriptions[Math.floor(Math.random() * descriptions.length)]
            onGenerated(randomDesc)
            setIsGenerating(false)
            toast.success("AI Description generated!")
        }, 1200)
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-primary border-primary/20 hover:bg-primary/5"
            onClick={generateDescription}
            disabled={isGenerating}
        >
            {isGenerating ? (
                <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
                <Sparkles className="h-3 w-3" />
            )}
            {isGenerating ? "Generating..." : "AI Generate Description"}
        </Button>
    )
}
