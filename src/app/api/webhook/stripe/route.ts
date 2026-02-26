import { db } from "@/server/db";
import { headers } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-02-25.clover",
    typescript: true,
})

export async function POST(req: NextRequest) {

    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature")!
    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const eventType = event.type
    console.log(`[Stripe Webhook] Received event type: ${eventType}`)

    if (eventType === "checkout.session.completed") {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        const session = event.data.object as Stripe.Checkout.Session
        const credits = Number(session.metadata?.credits)
        const userId = session.client_reference_id

        console.log(`[Stripe Webhook] Processing completion for User: ${userId}, Credits: ${credits}`)

        if (!userId || isNaN(credits)) {
            console.error("[Stripe Webhook] Missing userId or valid credits in session", { userId, credits })
            return NextResponse.json({ error: "Missing userId or credits" }, { status: 400 })
        }

        try {
            await db.stripeTransaction.create({
                data: {
                    userId,
                    credits,
                }
            })
            console.log(`[Stripe Webhook] Stripe transaction record created`)

            const updatedUser = await db.user.update({
                where: {
                    id: userId
                    // If you suspect ID mismatch, try email: session.customer_details?.email
                },
                data: {
                    credits: {
                        increment: credits
                    }
                }
            })
            console.log(`[Stripe Webhook] Successfully updated user ${userId}. New balance: ${updatedUser.credits}`)
            return NextResponse.json({ message: "Credits added successfully!" }, { status: 200 })
        } catch (dbError) {
            console.error("[Stripe Webhook] Database update failed:", dbError)
            return NextResponse.json({ error: "Database update failed" }, { status: 500 })
        }
    }




    return NextResponse.json({ message: "Success" })
}