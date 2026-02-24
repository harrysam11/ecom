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
} from "lucide-react"
import { prisma } from "@/lib/prisma"
import { SalesChart } from "@/components/admin/sales-chart"
import { format } from "date-fns"

export default async function DashboardPage() {
    // 1. Fetch Total Revenue
    const revenueResult = await prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } }
    })
    const totalRevenue = Number(revenueResult._sum.total || 0)

    // 2. Fetch Total Users
    const totalUsers = await prisma.user.count()

    // 3. Fetch Total Sales
    const totalSales = await prisma.order.count({
        where: { status: { in: ["PAID", "SHIPPED", "DELIVERED"] } }
    })

    // 4. Fetch Active Sessions (Users with sessions that haven't expired)
    const activeNow = await prisma.session.count({
        where: { expires: { gt: new Date() } }
    })

    // 5. Fetch Recent Orders
    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } }
    })

    // 6. Fetch Daily Sales for the last 7 days
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

    // Process daily orders into chart data
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
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-serif text-primary">Dashboard</h1>
            </div>
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-serif">
                            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime earnings
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Customers
                        </CardTitle>
                        <Users className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-serif">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            Registered accounts
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Successful Sales</CardTitle>
                        <CreditCard className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-serif">{totalSales}</div>
                        <p className="text-xs text-muted-foreground">
                            Completed transactions
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Online Sessions</CardTitle>
                        <Activity className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-serif">{activeNow}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently active users
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="font-serif text-primary">Revenue Overview</CardTitle>
                        <CardDescription>Daily sales revenue for the past week</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SalesChart data={chartData} />
                    </CardContent>
                </Card>
                <Card className="col-span-3 hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <CardTitle className="font-serif text-primary">Recent Orders</CardTitle>
                        <CardDescription>
                            Latest customer purchases
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentOrders.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No orders found.</p>
                            ) : (
                                recentOrders.map((order) => (
                                    <div key={order.id} className="flex items-center">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {order.user.name || "Unknown User"}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {order.user.email}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium font-serif">
                                            +${Number(order.total).toFixed(2)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
