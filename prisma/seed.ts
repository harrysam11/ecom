const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    const categories = [
        { name: "Electronics", slug: "electronics" },
        { name: "Clothing", slug: "clothing" },
        { name: "Home & Kitchen", slug: "home-kitchen" },
        { name: "Books", slug: "books" },
        { name: "Sports & Outdoors", slug: "sports-outdoors" },
    ]

    console.log("Seeding categories...")

    for (const category of categories) {
        await prisma.category.upsert({
            where: { name: category.name },
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
            name: "Admin User",
            password: hashedPassword,
            role: "ADMIN",
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
