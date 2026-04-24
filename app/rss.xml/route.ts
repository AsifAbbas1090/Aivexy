import { prisma } from '@/lib/prisma'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://aivexy.com'

  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true, category: true },
    orderBy: { publishedAt: 'desc' },
    take: 20,
  })

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Aivexy — AI &amp; Writing Intelligence</title>
    <link>${baseUrl}</link>
    <description>The definitive publication for AI tools, writing craft, and the future of content creation.</description>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt ?? ''}]]></description>
      <author>${post.author.email}</author>
      <category>${post.category.name}</category>
      ${post.publishedAt ? `<pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>` : ''}
    </item>`).join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}
