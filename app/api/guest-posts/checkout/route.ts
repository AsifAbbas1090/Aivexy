import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

const TIER_PRICES: Record<string, number> = {
  BASIC: 4900,
  FEATURED: 9900,
  SPONSORED: 19900,
}

export async function POST(req: NextRequest) {
  const { tier, guestPostId } = await req.json()

  if (!tier || !guestPostId || !TIER_PRICES[tier]) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey || stripeKey.startsWith('REPLACE')) {
    // Stripe not configured — skip to success page directly
    return NextResponse.json({ url: null }, { status: 200 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: `Aivexy Guest Post — ${tier.charAt(0) + tier.slice(1).toLowerCase()} Package` },
          unit_amount: TIER_PRICES[tier],
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${siteUrl}/guest-post/success?id=${guestPostId}`,
    cancel_url: `${siteUrl}/guest-post`,
    metadata: { guestPostId, tier },
  })

  return NextResponse.json({ url: session.url })
}
