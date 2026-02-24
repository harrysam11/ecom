import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"
import { getStoreOrThrow } from "@/lib/store"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { prisma } from "@/lib/prisma"

export default async function CategoriesPage() {
    const store = await getStoreOrThrow()
    const categories = await prisma.category.findMany({
        where: { storeId: store.id },
        include: {
            parent: true,
            _count: {
                select: { products: true }
            }
        }
    })

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-semibold md:text-2xl font-serif text-primary">Categories</h1>
                    <p className="text-sm text-muted-foreground">Manage your product categories and hierarchy.</p>
                </div>
                <Button size="sm" className="h-7 gap-1" asChild>
                    <Link href="/categories/new">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span>Add Category</span>
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="font-serif">All Categories</CardTitle>
                    <CardDescription>
                        A list of all categories in your store.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Parent</TableHead>
                                <TableHead>Products</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((cat) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell>{cat.slug}</TableCell>
                                    <TableCell>{cat.parent?.name || "-"}</TableCell>
                                    <TableCell>{cat._count.products}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/categories/${cat.id}`}>Edit</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No categories found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
