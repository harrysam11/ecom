import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Activity,
    CreditCard,
    DollarSign,
    Users,
    Store,
    ShoppingBag,
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { SalesChart } from "@/components/admin/sales-chart"
import { format } from "date-fns"

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    // 1. Fetch Global Revenue
    const revenueResult = await prisma.order.aggregate({
        _sum: { total: true },
        where: {
            status: { in: ["PAID", "SHIPPED", "DELIVERED"] }
        }
    })
    const totalRevenue = Number(revenueResult._sum.total || 0)

    // 2. Fetch Total Stores
    const totalStores = await prisma.store.count()

    // 3. Fetch Total Users
    const totalUsers = await prisma.user.count()

    // 4. Fetch Total Products
    const totalProducts = await prisma.product.count()

    // 5. Fetch Recent Orders (Global)
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { name: true, email: true } },
            store: { select: { name: true } }
        }
    })

    // 6. Fetch Daily Global Sales (Last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const dailyOrders = await prisma.order.findMany({
        where: {
            createdAt: { gte: sevenDaysAgo },
            status: { in: ["PAID", "SHIPPED", "DELIVERED"] }
        },
        select: {
            createdAt: true,
            total: true,
        },
    })

    const chartDataMap = new Map()
    for (let i = 0; i < 7; i++) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateString = format(date, "MMM dd")
        chartDataMap.set(dateString, 0)
    }

    dailyOrders.forEach(order => {
        const dateString = format(order.createdAt, "MMM dd")
        if (chartDataMap.has(dateString)) {
            chartDataMap.set(dateString, chartDataMap.get(dateString) + Number(order.total))
        }
    })

    const chartData = Array.from(chartDataMap.entries())
        .map(([date, revenue]) => ({ date, revenue }))
        .reverse()

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary">Platform Overview</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Global Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across all stores</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
                        <Store className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalStores}</div>
                        <p className="text-xs text-muted-foreground">Active on platform</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Customers & Owners</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalProducts}</div>
                        <p className="text-xs text-muted-foreground">Listed globally</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle>Platform Revenue</CardTitle>
                        <CardDescription>Daily global sales for the past week</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SalesChart data={chartData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest orders across the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentOrders.map((order) => (
                                <div key={order.id} className="flex items-center">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {order.user.name || "Unknown"} at {order.store.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{order.user.email}</p>
                                    </div>
                                    <div className="ml-auto font-medium">+${Number(order.total).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

