import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function getStore() {
    const hostnameWithPort = (await headers()).get("host") || ""
    const hostname = hostnameWithPort.split(":")[0]

    // Define domains to exclude from subdomain routing
    const rootDomains = ["localhost", "ecom-saas.com"]

    let subdomain = ""
    if (hostname === "localhost" || hostname === "ecom-saas.com") {
        subdomain = "platform"
    } else if (hostname.endsWith(".localhost")) {
        subdomain = hostname.replace(".localhost", "")
    } else {
        subdomain = hostname.split(".")[0]
    }

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

export async function currentStore() {
    try {
        return await getStore()
    } catch {
        return null
    }
}
