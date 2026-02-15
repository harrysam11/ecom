import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // Mock products for sitemap (in real app, fetch from DB)
    const products = ["wireless-headphones", "minimalist-watch", "fitness-tracker", "leather-backpack", "ergonomic-chair"];
    const categories = ["tech", "fashion", "accessories", "furniture"];

    const productUrls = products.map((slug) => ({
        url: `${baseUrl}/product/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    const categoryUrls = categories.map((slug) => ({
        url: `${baseUrl}/products?category=${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/products`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/categories`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        ...productUrls,
        ...categoryUrls,
    ];
}
