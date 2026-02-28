
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const stores = await prisma.store.findMany({
        include: { siteSettings: true }
    })
    console.log(JSON.stringify(stores, null, 2))
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
