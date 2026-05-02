import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.dahlia',
})

export const GUEST_POST_PRICES = {
  STANDARD: { amount: 9900, label: 'Standard ($99)' },
  FEATURED: { amount: 19900, label: 'Featured ($199)' },
  PREMIUM: { amount: 34900, label: 'Premium ($349)' },
} as const
