import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !webhookSecret || webhookSecret.startsWith('REPLACE')) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const { guestPostId } = session.metadata || {}

    if (guestPostId) {
      await prisma.guestPost.update({
        where: { id: guestPostId },
        data: {
          paid: true,
          paymentId: session.payment_intent,
          status: 'PENDING',
        },
      })
    }
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object as any
    console.error('Payment failed:', intent.id)
  }

  return NextResponse.json({ received: true })
}
