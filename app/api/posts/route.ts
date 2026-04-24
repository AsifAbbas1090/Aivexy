import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, slug, excerpt, content, coverImage, categoryId, tags, published, featured, sponsored, readTime } = body

  if (!title || !content || !categoryId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user!.email! } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const post = await prisma.post.create({
    data: {
      title,
      slug: slug || slugify(title),
      excerpt: excerpt || null,
      content,
      coverImage: coverImage || null,
      published: !!published,
      featured: !!featured,
      sponsored: !!sponsored,
      readTime: readTime || null,
      publishedAt: published ? new Date() : null,
      author: { connect: { id: user.id } },
      category: { connect: { id: categoryId } },
      tags: tags?.length
        ? {
            connectOrCreate: tags.map((name: string) => ({
              where: { name },
              create: { name, slug: slugify(name) },
            })),
          }
        : undefined,
    },
  })

  return NextResponse.json(post, { status: 201 })
}
