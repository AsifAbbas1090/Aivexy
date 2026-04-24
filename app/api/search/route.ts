import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const results = await prisma.$queryRaw<any[]>`
    SELECT p.id, p.title, p.slug, p.excerpt, p."coverImage", p."publishedAt", p."readTime",
           c.name as "categoryName", c.slug as "categorySlug", c.color as "categoryColor",
           u.name as "authorName"
    FROM "Post" p
    JOIN "Category" c ON p."categoryId" = c.id
    JOIN "User" u ON p."authorId" = u.id
    WHERE p.published = true
      AND (
        to_tsvector('english', p.title || ' ' || COALESCE(p.excerpt, '') || ' ' || p.content)
        @@ plainto_tsquery('english', ${q})
      )
    ORDER BY p."publishedAt" DESC
    LIMIT 20
  `

  return NextResponse.json({ results })
}
