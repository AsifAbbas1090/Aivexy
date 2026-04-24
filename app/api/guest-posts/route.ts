import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const session = await getServerSession(authOptions)

  const { title, content, authorName, authorEmail, authorBio, tier } = body

  if (!title || !content || !authorName || !authorEmail || !tier) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const validTiers = ['BASIC', 'FEATURED', 'SPONSORED']
  if (!validTiers.includes(tier)) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })
  }

  const post = await prisma.guestPost.create({
    data: {
      title,
      content,
      authorName,
      authorEmail,
      authorBio: authorBio || null,
      tier,
      ...(session?.user?.email
        ? {
            user: {
              connect: { email: session.user.email },
            },
          }
        : {}),
    },
  })

  return NextResponse.json({ id: post.id }, { status: 201 })
}
