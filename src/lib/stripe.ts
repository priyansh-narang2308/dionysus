"use server"

import { auth } from "@clerk/nextjs/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
})

export async function createCheckoutSession(credits: number) {
    const { userId } = await auth()
    if (!userId) {
        throw new Error("User not found")
    }

    const amount = Math.round((credits / 50) * 100)

    // Stripe minimum charge is $0.50 USD
    if (amount < 50) {
        throw new Error("Minimum purchase amount is $0.50 (25 credits)")
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: `${credits} Credits`,
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            },
        ],
        customer_creation: "always",
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/create-project`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/billing`,
        client_reference_id: userId.toString(),
        metadata: {
            credits: credits.toString(), //who bought it and how many credits
        }
    })
    return session.url
}