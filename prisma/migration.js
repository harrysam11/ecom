const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    console.log("🚀 Starting Lean Multi-tenant MVP Migration...")

    // 1. Create Default Store
    const store = await prisma.store.upsert({
        where: { subdomain: "main" },
        update: {},
        create: {
            name: "Main Store",
            subdomain: "main",
            plan: "FREE"
        }
    })
    console.log(`✅ Default Store created: ${store.name} (${store.id})`)

    // 2. Create Default Settings
    await prisma.settings.upsert({
        where: { storeId: store.id },
        update: {},
        create: {
            storeId: store.id,
            siteName: "Main Store",
            footerText: "© 2026 Main Store. Built with SaaS MVP."
        }
    })
    console.log(`✅ Default settings created.`)

    // 3. Handle User Roles (Existing users will be mapped to the main store)
    const users = await prisma.user.findMany()
    for (const user of users) {
        await prisma.storeUser.upsert({
            where: { userId_storeId: { userId: user.id, storeId: store.id } },
            update: { role: "STORE_OWNER" },
            create: {
                userId: user.id,
                storeId: store.id,
                role: "STORE_OWNER"
            }
        })
    }
    console.log(`✅ Linked ${users.length} users to the main store.`)

    console.log("🎉 MVP Migration Finished Successfully!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
