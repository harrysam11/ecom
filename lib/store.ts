import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function getStore() {
    const hostname = (await headers()).get("host") || ""
    const subdomain = hostname.split(".")[0]

    const store = await prisma.store.findUnique({
        where: { subdomain },
        include: {
            siteSettings: true
        }
    })

    return store
}

export async function getStoreOrThrow() {
    const store = await getStore()
    if (!store) {
        throw new Error("Store not found")
    }
    return store
}
