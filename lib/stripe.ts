import Stripe from 'stripe'

const apiVersion = '2026-03-25.dahlia' as const

let stripeClient: Stripe | undefined

/** Lazily construct Stripe so `next build` works when STRIPE_SECRET_KEY is unset. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key || key.startsWith('REPLACE')) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  stripeClient ??= new Stripe(key, { apiVersion })
  return stripeClient
}

export const GUEST_POST_PRICES = {
  STANDARD: { amount: 9900, label: 'Standard ($99)' },
  FEATURED: { amount: 19900, label: 'Featured ($199)' },
  PREMIUM: { amount: 34900, label: 'Premium ($349)' },
} as const
