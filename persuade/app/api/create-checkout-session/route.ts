import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-02-24.acacia'
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { priceId, userId, planName, interval } = body

        if (!priceId) {
            return NextResponse.json(
                { error: 'Price ID is required' },
                { status: 400 }
            )
        }

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
            metadata: {
                userId,
                planName,
                interval
            },
        })

        return NextResponse.json({ url: session.url })
    } catch (error: unknown) {
        console.error('Stripe error:', error instanceof Error ? error.message : 'Unknown error')
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Something went wrong' },
            { status: 500 }
        )
    }
} 