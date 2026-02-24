const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
    console.log("🚀 Starting Multi-tenant Data Migration...")

    // 1. Create Default Store
    const store = await prisma.store.upsert({
        where: { subdomain: "main" },
        update: {},
        create: {
            name: "Main Store",
            subdomain: "main",
        }
    })
    console.log(`✅ Default Store created: ${store.name} (${store.id})`)

    // 2. Link Categories
    const categories = await prisma.category.updateMany({
        data: { storeId: store.id }
    })
    console.log(`✅ Linked ${categories.count} categories.`)

    // 3. Link Products
    const products = await prisma.product.updateMany({
        data: { storeId: store.id }
    })
    console.log(`✅ Linked ${products.count} products.`)

    // 4. Link Orders
    const orders = await prisma.order.updateMany({
        data: { storeId: store.id }
    })
    console.log(`✅ Linked ${orders.count} orders.`)

    // 5. Link Coupons
    const coupons = await prisma.coupon.updateMany({
        data: { storeId: store.id }
    })
    console.log(`✅ Linked ${coupons.count} coupons.`)

    // 6. Link Settings
    const settingsCount = await prisma.settings.count()
    if (settingsCount > 0) {
        await prisma.settings.updateMany({
            data: { storeId: store.id }
        })
    } else {
        await prisma.settings.create({
            data: {
                storeId: store.id,
                siteName: "Main Store"
            }
        })
    }
    console.log(`✅ Linked/Created store settings.`)

    // 7. Link Shipping Zones
    const shippingZones = await prisma.shippingZone.updateMany({
        data: { storeId: store.id }
    })
    console.log(`✅ Linked ${shippingZones.count} shipping zones.`)

    // 8. Link Carts
    const carts = await prisma.cart.updateMany({
        data: { storeId: store.id }
    })
    console.log(`✅ Linked ${carts.count} carts.`)

    // 9. Link Wishlists
    const wishlists = await prisma.wishlist.updateMany({
        data: { storeId: store.id }
    })
    console.log(`✅ Linked ${wishlists.count} wishlists.`)

    // 10. Link Return Requests
    const returnRequests = await prisma.returnRequest.updateMany({
        data: { storeId: store.id }
    })
    console.log(`✅ Linked ${returnRequests.count} return requests.`)

    // 11. Handle User Roles and Store Users
    const users = await prisma.user.findMany()
    for (const user of users) {
        let newRole = user.role
        // Map old roles if they still exist or are in legacy format
        if (user.role === "ADMIN") newRole = "SUPER_ADMIN"
        if (user.role === "USER") newRole = "CUSTOMER"

        await prisma.user.update({
            where: { id: user.id },
            data: { role: newRole }
        })

        if (newRole === "SUPER_ADMIN" || newRole === "STORE_OWNER" || newRole === "STORE_STAFF") {
            await prisma.storeUser.upsert({
                where: { userId_storeId: { userId: user.id, storeId: store.id } },
                update: { role: newRole === "SUPER_ADMIN" ? "STORE_OWNER" : "STORE_STAFF" },
                create: {
                    userId: user.id,
                    storeId: store.id,
                    role: newRole === "SUPER_ADMIN" ? "STORE_OWNER" : "STORE_STAFF"
                }
            })
        }
    }
    console.log(`✅ Migrated roles and linked ${users.length} users.`)

    console.log("🎉 Migration Finished Successfully!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
