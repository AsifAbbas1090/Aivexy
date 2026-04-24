import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any)?.role !== 'ADMIN') return null
  return session
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { title, slug, excerpt, content, coverImage, categoryId, tags, published, featured, sponsored, readTime } = body

  const post = await prisma.post.update({
    where: { id: params.id },
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
      ...(categoryId ? { category: { connect: { id: categoryId } } } : {}),
      ...(tags
        ? {
            tags: {
              set: [],
              connectOrCreate: tags.map((name: string) => ({
                where: { name },
                create: { name, slug: slugify(name) },
              })),
            },
          }
        : {}),
    },
  })

  return NextResponse.json(post)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
}
