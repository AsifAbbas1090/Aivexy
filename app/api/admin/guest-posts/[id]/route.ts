import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action, adminNotes } = await req.json()

  if (action === 'approve') {
    const guestPost = await prisma.guestPost.findUnique({ where: { id: params.id } })
    if (!guestPost) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const admin = await prisma.user.findUnique({ where: { email: session.user!.email! } })
    if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 })

    const defaultCat = await prisma.category.findFirst()

    const post = await prisma.post.create({
      data: {
        title: guestPost.title,
        slug: slugify(guestPost.title) + '-' + Date.now(),
        content: guestPost.content,
        published: true,
        publishedAt: new Date(),
        author: { connect: { id: admin.id } },
        category: { connect: { id: defaultCat!.id } },
      },
    })

    await prisma.guestPost.update({
      where: { id: params.id },
      data: { status: 'PUBLISHED', adminNotes, reviewedAt: new Date(), publishedAt: new Date() },
    })

    return NextResponse.json({ success: true, postId: post.id })
  }

  if (action === 'reject') {
    await prisma.guestPost.update({
      where: { id: params.id },
      data: { status: 'REJECTED', adminNotes, reviewedAt: new Date() },
    })
    return NextResponse.json({ success: true })
  }

  if (action === 'revision') {
    await prisma.guestPost.update({
      where: { id: params.id },
      data: { status: 'REVISION_REQUESTED', adminNotes, reviewedAt: new Date() },
    })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
