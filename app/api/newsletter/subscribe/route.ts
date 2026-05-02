import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getResend } from '@/lib/resend'

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? 'newsletter@aivexy.com'
const SITE_NAME = 'Aivexy'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 400 })
  }

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'already_subscribed' }, { status: 409 })
  }

  await prisma.newsletterSubscriber.create({ data: { email } })

  const resend = getResend()
  if (!resend) {
    return NextResponse.json({ success: true, emailSent: false }, { status: 201 })
  }

  // Send welcome email
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Welcome to ${SITE_NAME} — You're in!`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
          <h1 style="color: #4f46e5; font-size: 28px; margin-bottom: 8px;">Welcome to Aivexy ⚡</h1>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            You're now part of a community of 2,400+ bloggers and content creators staying ahead of the AI writing curve.
          </p>
          <h2 style="color: #111827; font-size: 18px; margin-top: 32px;">Start with these top reads:</h2>
          <ul style="padding-left: 20px; color: #374151; line-height: 2;">
            <li><a href="${process.env.NEXT_PUBLIC_URL}/blog/gpt-4o-vs-claude-3-5-sonnet" style="color: #4f46e5;">GPT-4o vs Claude 3.5 Sonnet: Which Wins in 2025?</a></li>
            <li><a href="${process.env.NEXT_PUBLIC_URL}/blog/prompt-engineering-for-bloggers" style="color: #4f46e5;">15 Prompts That Produce Publishable Drafts</a></li>
            <li><a href="${process.env.NEXT_PUBLIC_URL}/blog/building-3000-month-blog" style="color: #4f46e5;">Building a $3,000/Month Blog: The Realistic Timeline</a></li>
          </ul>
          <p style="color: #9ca3af; font-size: 13px; margin-top: 48px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
            You're receiving this because you subscribed at aivexy.com.
            <a href="${process.env.NEXT_PUBLIC_URL}/unsubscribe?email=${encodeURIComponent(email)}" style="color: #9ca3af;">Unsubscribe</a>
          </p>
        </div>
      `,
    })
  } catch (e) {
    // Don't fail the subscription if email fails
    console.error('Welcome email failed:', e)
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
