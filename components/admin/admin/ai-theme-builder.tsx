"use client"

import { useState } from "react"
import { Bot, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface AIThemeBuilderProps {
    onThemeGenerated: (theme: { themeColor: string; fontFamily: string }) => void
}

export function AIThemeBuilder({ onThemeGenerated }: AIThemeBuilderProps) {
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error("Please describe your ideal store theme first.")
            return
        }

        setIsGenerating(true)

        // Simulate AI generation based on keywords
        setTimeout(() => {
            const lowerPrompt = prompt.toLowerCase()
            let newColor = "#000000"
            let newFont = "inter"

            // Simple heuristic "AI" simulation
            if (lowerPrompt.includes("luxury") || lowerPrompt.includes("elegant") || lowerPrompt.includes("jewelry")) {
                newColor = "#D4AF37" // Gold
                newFont = "playfair"
            } else if (lowerPrompt.includes("eco") || lowerPrompt.includes("nature") || lowerPrompt.includes("green")) {
                newColor = "#2E8B57" // SeaGreen
                newFont = "poppins"
            } else if (lowerPrompt.includes("tech") || lowerPrompt.includes("modern") || lowerPrompt.includes("future")) {
                newColor = "#0f172a" // Slate
                newFont = "roboto"
            } else if (lowerPrompt.includes("fun") || lowerPrompt.includes("kids") || lowerPrompt.includes("colorful")) {
                newColor = "#FF69B4" // HotPink
                newFont = "poppins"
            } else {
                // Randomize slightly for generic prompts
                const colors = ["#4F46E5", "#E11D48", "#059669", "#D97706"]
                const fonts = ["inter", "poppins", "roboto"]
                newColor = colors[Math.floor(Math.random() * colors.length)]
                newFont = fonts[Math.floor(Math.random() * fonts.length)]
            }

            onThemeGenerated({ themeColor: newColor, fontFamily: newFont })
            setIsGenerating(false)
            toast.success("AI Theme Generated! Don't forget to save changes.")
        }, 1500)
    }

    return (
        <Card className="mb-8 border-2 border-primary/20 bg-primary/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    AI Theme Builder
                </CardTitle>
                <CardDescription>
                    Describe your brand, and our AI will instantly generate the perfect color palette and font pairing for your storefront.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Textarea
                    placeholder="e.g. 'A luxury jewelry brand with an elegant and gold aesthetic' or 'A modern minimalist tech store'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="resize-none h-24 bg-white"
                />
                <Button
                    type="button"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full sm:w-auto flex items-center gap-2"
                >
                    {isGenerating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4" />
                    )}
                    {isGenerating ? "Generating Magic..." : "Generate AI Theme"}
                </Button>
            </CardContent>
        </Card>
    )
}
