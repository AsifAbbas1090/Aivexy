import { Resend } from 'resend'

let client: Resend | undefined

/** Lazily construct Resend so `next build` works when RESEND_API_KEY is unset. */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key || key.startsWith('REPLACE')) return null
  client ??= new Resend(key)
  return client
}
