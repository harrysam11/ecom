const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    console.log("Seeding store...")
    const store = await prisma.store.upsert({
        where: { subdomain: "admin" },
        update: {},
        create: {
            name: "Main Store",
            subdomain: "admin",
            plan: "PREMIUM",
        },
    })

    const categories = [
        { name: "Electronics", slug: "electronics", storeId: store.id },
        { name: "Clothing", slug: "clothing", storeId: store.id },
        { name: "Home & Kitchen", slug: "home-kitchen", storeId: store.id },
        { name: "Books", slug: "books", storeId: store.id },
        { name: "Sports & Outdoors", slug: "sports-outdoors", storeId: store.id },
    ]

    console.log("Seeding categories...")

    for (const category of categories) {
        await prisma.category.upsert({
            where: {
                storeId_name: {
                    storeId: store.id,
                    name: category.name
                }
            },
            update: {},
            create: category,
        })
    }

    console.log("Seeding admin user...")
    const bcrypt = require("bcryptjs")
    const hashedPassword = await bcrypt.hash("admin123", 10)

    await prisma.user.upsert({
        where: { email: "admin@ecom.com" },
        update: {},
        create: {
            email: "admin@ecom.com",
            name: "Platform Admin",
            password: hashedPassword,
            role: "SUPER_ADMIN",
            emailVerified: new Date(),
        },
    })

    console.log("Seeding store owner...")
    const ownerPassword = await bcrypt.hash("owner123", 10)
    const owner = await prisma.user.upsert({
        where: { email: "owner@ecom.com" },
        update: {},
        create: {
            email: "owner@ecom.com",
            name: "Store Owner",
            password: ownerPassword,
            role: "STORE_OWNER",
            emailVerified: new Date(),
        },
    })

    // Link owner to the store
    await prisma.storeUser.upsert({
        where: { userId_storeId: { userId: owner.id, storeId: store.id } },
        update: {},
        create: {
            userId: owner.id,
            storeId: store.id,
            role: "STORE_OWNER",
        },
    })

    console.log("Seeding customer...")
    const customerPassword = await bcrypt.hash("customer123", 10)
    await prisma.user.upsert({
        where: { email: "user@ecom.com" },
        update: {},
        create: {
            email: "user@ecom.com",
            name: "Test Customer",
            password: customerPassword,
            role: "CUSTOMER",
            emailVerified: new Date(),
        },
    })


    console.log("Seeding finished.")
}


main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
