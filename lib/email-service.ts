import { prisma } from "@/lib/prisma"

export class EmailService {
    static async sendEmail({
        to,
        subject,
        template,
        data
    }: {
        to: string
        subject: string
        template: string
        data?: any
    }) {
        console.log(`[EmailService] Sending email to ${to}: ${subject} (Template: ${template})`)
        console.log(`[EmailService] Data:`, data)

        try {
            // In a real app, integrate with Resend/Nodemailer here
            const status = "SENT" // Mock success

            await prisma.emailLog.create({
                data: {
                    to,
                    subject,
                    template,
                    status,
                }
            })

            return { success: true }
        } catch (error: any) {
            console.error(`[EmailService] Failed to log email:`, error)
            return { success: false, error: error.message }
        }
    }

    static async sendOrderConfirmation(order: any) {
        return this.sendEmail({
            to: order.user.email,
            subject: `Order Confirmation - #${order.id.slice(-6).toUpperCase()}`,
            template: "ORDER_CONFIRMATION",
            data: {
                orderNumber: order.orderNumber,
                total: order.total,
                items: order.items.length
            }
        })
    }

    static async sendWelcomeEmail(user: any) {
        return this.sendEmail({
            to: user.email,
            subject: "Welcome to Antigravity E-com!",
            template: "WELCOME",
            data: { name: user.name }
        })
    }

    static async sendShippingEmail(order: any) {
        const text = `Hi ${order.user.name}, your order #${order.orderNumber.slice(-6).toUpperCase()} has been ${order.status.toLowerCase()}. Tracking Number: ${order.trackingNumber || 'N/A'}`
        console.log(`[EMAIL] To: ${order.user.email} | Subject: Order ${order.status} | Content: ${text}`)

        await prisma.emailLog.create({
            data: {
                to: order.user.email,
                subject: `Order ${order.status}`,
                template: 'SHIPPING_NOTIFICATION',
                status: 'SENT'
            }
        })
    }
}
