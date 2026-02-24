import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { PrintInvoiceButton } from "@/components/admin/print-invoice-button"

export default async function PackingSlipPage({ params }: { params: { id: string } }) {
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            items: {
                include: { product: true }
            },
            address: true
        }
    })

    if (!order) notFound()

    return (
        <div className="bg-white min-h-screen p-8 text-black print:p-0">
            <div className="flex justify-end mb-8">
                <PrintInvoiceButton />
            </div>

            <div className="flex justify-between items-start border-b pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight uppercase">Packing Slip</h1>
                    <p className="text-muted-foreground mt-2">Order #{order.orderNumber.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold font-serif">ANTIGRAVITY E-COM</h2>
                    <p className="text-sm">Warehouse Fulfillment Center</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
                <div className="border p-4 rounded-lg">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Ship To:</h3>
                    <p className="font-bold text-lg">{order.user.name}</p>
                    <p className="text-sm">{order.address?.street}</p>
                    <p className="text-sm">{order.address?.city}, {order.address?.state} {order.address?.zip}</p>
                    <p className="text-sm font-bold mt-1">{order.address?.country}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Order Details:</h3>
                    <p className="text-sm"><span className="font-bold">Date:</span> {format(order.createdAt, "MMM dd, yyyy")}</p>
                    <p className="text-sm"><span className="font-bold">Shipping Method:</span> {order.courierName || "Standard Shipping"}</p>
                </div>
            </div>

            <table className="w-full mb-12 border-collapse">
                <thead>
                    <tr className="bg-muted/50 border-b-2 border-black text-left">
                        <th className="py-3 px-4 font-bold uppercase text-xs">SKU</th>
                        <th className="py-3 px-4 font-bold uppercase text-xs">Product Item</th>
                        <th className="py-3 px-4 font-bold uppercase text-xs text-center">Qty to Pack</th>
                        <th className="py-3 px-4 font-bold uppercase text-xs text-right">Checked</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.id} className="border-b">
                            <td className="py-4 px-4 font-mono text-xs text-muted-foreground">
                                {item.productId.slice(-8).toUpperCase()}
                            </td>
                            <td className="py-4 px-4 flex items-center gap-3">
                                <div>
                                    <p className="font-bold">{item.product.name}</p>
                                    <div className="flex gap-2">
                                        <div className="border border-dashed w-4 h-4 rounded mt-1"></div>
                                        <p className="text-[10px] text-muted-foreground">Verify item condition and variant before packing.</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-xl">{item.quantity}</td>
                            <td className="py-4 px-4 text-right">
                                <div className="inline-block border-2 border-dashed border-muted w-8 h-8 rounded-lg"></div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="mt-auto pt-12 text-center text-[10px] text-muted-foreground border-t italic">
                <p>Packed by: ________________________  Date: ________________________</p>
            </div>
        </div>
    )
}
