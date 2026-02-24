import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { PrintInvoiceButton } from "@/components/admin/print-invoice-button"
import { getSettings } from "@/lib/admin-actions"

export default async function InvoicePage({ params }: { params: { id: string } }) {
    const [order, settings] = await Promise.all([
        prisma.order.findUnique({
            where: { id: params.id },
            include: {
                user: true,
                items: {
                    include: { product: true }
                },
                shippingAddress: true
            }
        }),
        getSettings()
    ])

    if (!order) notFound()

    return (
        <div className="bg-white min-h-screen p-8 text-black print:p-0">
            {/* Print Button - Hidden on print */}
            <div className="flex justify-end mb-8">
                <PrintInvoiceButton />
            </div>

            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b pb-8 mb-8">
                <div>
                    <h1 className="text-4xl font-serif font-bold tracking-tight">INVOICE</h1>
                    <p className="text-muted-foreground mt-2">Order #{order.orderNumber.slice(-6).toUpperCase()}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold font-serif">{settings?.siteName || "ANTIGRAVITY E-COM"}</h2>
                    <p className="text-sm whitespace-pre-line">{settings?.address || "123 E-commerce Street\nTech City, TC 10101"}</p>
                    <p className="text-sm">{settings?.email || "support@antigravity.ecom"}</p>
                    {settings?.phone && <p className="text-sm">{settings.phone}</p>}
                </div>
            </div>

            {/* Billing & Shipping */}
            <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Bill To:</h3>
                    <p className="font-bold">{order.user.name}</p>
                    <p className="text-sm">{order.user.email}</p>
                    <p className="text-sm">{order.shippingAddress?.street}</p>
                    <p className="text-sm">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                    <p className="text-sm">{order.shippingAddress?.country}</p>
                </div>
                <div className="text-right">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">Invoice Details:</h3>
                    <p className="text-sm"><span className="font-bold">Date:</span> {format(order.createdAt, "MMMM dd, yyyy")}</p>
                    <p className="text-sm"><span className="font-bold">Payment:</span> {order.paymentStatus}</p>
                    <p className="text-sm"><span className="font-bold">Status:</span> {order.status}</p>
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full mb-12 border-collapse">
                <thead>
                    <tr className="border-b-2 border-black text-left">
                        <th className="py-3 font-bold uppercase text-xs">Description</th>
                        <th className="py-3 font-bold uppercase text-xs text-center">Quantity</th>
                        <th className="py-3 font-bold uppercase text-xs text-right">Unit Price</th>
                        <th className="py-3 font-bold uppercase text-xs text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.id} className="border-b">
                            <td className="py-4">
                                <p className="font-bold">{item.product.name}</p>
                            </td>
                            <td className="py-4 text-center">{item.quantity}</td>
                            <td className="py-4 text-right">${Number(item.price).toFixed(2)}</td>
                            <td className="py-4 text-right font-bold">${(Number(item.price) * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>${Number(order.total).toFixed(2)}</span>
                    </div>
                    {settings?.taxPercentage ? (
                        <div className="flex justify-between text-sm">
                            <span>Tax ({settings.taxPercentage}%):</span>
                            <span>${(Number(order.total) * (Number(settings.taxPercentage) / 100)).toFixed(2)}</span>
                        </div>
                    ) : null}
                    <div className="flex justify-between text-sm">
                        <span>Shipping:</span>
                        <span>$0.00</span>
                    </div>
                    <div className="flex justify-between border-t-2 border-black pt-3 text-lg font-bold font-serif">
                        <span>Grand Total:</span>
                        <span>${(Number(order.total) * (1 + (Number(settings?.taxPercentage || 0) / 100))).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Footer Note */}
            <div className="mt-24 pt-8 border-t text-center text-xs text-muted-foreground">
                <p>{settings?.footerText || "Thank you for your business! If you have any questions about this invoice, please contact us."}</p>
                <p className="mt-2">© {new Date().getFullYear()} {settings?.companyName || settings?.siteName || "Antigravity E-com"}. All rights reserved.</p>
            </div>
        </div>
    )
}
