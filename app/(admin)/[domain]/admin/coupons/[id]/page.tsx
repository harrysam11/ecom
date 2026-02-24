import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CouponForm } from "@/components/admin/coupon-form"

export default async function CouponEditPage({ params }: { params: { id: string } }) {
    const coupon = await prisma.coupon.findUnique({
        where: { id: params.id }
    })

    if (!coupon) notFound()

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <CouponForm initialData={coupon as any} />
        </div>
    )
}
