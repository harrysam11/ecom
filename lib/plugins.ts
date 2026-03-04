export const AVAILABLE_PLUGINS = [
    {
        id: "whatsapp-chat",
        name: "WhatsApp Support",
        description: "Add a floating WhatsApp chat button to your storefront.",
        icon: "MessageSquare",
        category: "Customer Support",
    },
    {
        id: "google-analytics",
        name: "Enhanced Analytics",
        description: "Track visitor behavior and sales conversions with Google Analytics.",
        icon: "BarChart",
        category: "Marketing",
    },
    {
        id: "abandoned-cart",
        name: "Abandoned Cart Recovery",
        description: "Automatically email customers who leave items in their cart.",
        icon: "ShoppingCart",
        category: "Sales",
    },
    {
        id: "ai-product-desc",
        name: "AI Product Descriptions",
        description: "Generate SEO-friendly product descriptions using AI.",
        icon: "Zap",
        category: "Productivity",
    },
    {
        id: "reviews-pro",
        name: "Product Reviews Pro",
        description: "Enable customers to upload photos and videos with their reviews.",
        icon: "Star",
        category: "Social Proof",
    }
]

export type PluginId = typeof AVAILABLE_PLUGINS[number]["id"]
