import { stripe } from "@/lib/stripe"
import { NextResponse } from "next/server"
import { getUser } from "@/lib/auth-actions"

export async function POST(request: Request) {
    try {
        const bodyContent = await request.text()
        if (!bodyContent) {
            return new NextResponse("Bad Request: Empty Body", { status: 400 })
        }
        const { priceId } = JSON.parse(bodyContent)
        const user = await getUser()

        if (!user || !user.email) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/setup?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#pricing`,
            customer_email: user.email,
            metadata: {
                userId: user.id,
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (error: any) {
        console.error("[STRIPE_CHECKOUT_ERROR]", error)
        return new NextResponse("Internal Error", { status: 500 })
    }
}
