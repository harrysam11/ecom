export const PRICING_PLANS = {
    FREE: {
        name: "Free",
        feePercentage: 0.01, // 1%
        productsLimit: 10,
    },
    PRO: {
        name: "Pro",
        feePercentage: 0.005, // 0.5%
        productsLimit: Infinity,
    },
    PREMIUM: {
        name: "Premium",
        feePercentage: 0, // 0%
        productsLimit: Infinity,
    }
}

export function calculateAppFee(amount: number, plan: keyof typeof PRICING_PLANS) {
    const feePercentage = PRICING_PLANS[plan].feePercentage
    return amount * feePercentage
}

export function getPlanDetails(plan: keyof typeof PRICING_PLANS) {
    return PRICING_PLANS[plan]
}
