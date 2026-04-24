import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import AuthorBio from '@/components/blog/AuthorBio'
import ShareButtons from '@/components/blog/ShareButtons'
import ArticleCard from '@/components/blog/ArticleCard'
import AdSlot from '@/components/ads/AdSlot'
import { Clock, Eye, Calendar } from 'lucide-react'
import type { Metadata } from 'next'
import ReadingProgress from '@/components/blog/ReadingProgress'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: { author: true, category: true },
  })
  if (!post) return { title: 'Not Found' }

  const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: `${siteUrl}/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name ?? 'Aivexy'],
      images: post.coverImage ? [{ url: post.coverImage }] : [{ url: `${siteUrl}/og-default.png` }],
    },
  }
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({ where: { published: true }, select: { slug: true } })
  return posts.map(p => ({ slug: p.slug }))
}

export default async function ArticlePage({ params }: Props) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: { author: true, category: true, tags: true },
  })
  if (!post) notFound()

  const related = await prisma.post.findMany({
    where: { published: true, categoryId: post.categoryId, NOT: { id: post.id } },
    include: { author: true, category: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })

  const siteUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  const postUrl = `${siteUrl}/blog/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ?? undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Person', name: post.author.name },
    publisher: { '@type': 'Organization', name: 'Aivexy' },
  }

  // Increment views (fire-and-forget)
  prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } }).catch(() => {})

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ReadingProgress />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          {/* Article */}
          <article>
            {/* Category + Sponsored */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: post.category.color || '#6366f1' }}
              >
                {post.category.name}
              </span>
              {post.sponsored && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                  Sponsored Content
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8 pb-8 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-200 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-sm font-semibold flex items-center justify-center">
                  {post.author.name?.[0] ?? 'A'}
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300">{post.author.name}</span>
              </div>
              {post.publishedAt && (
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{formatDate(post.publishedAt)}</span>
              )}
              {post.readTime && (
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{post.readTime} min read</span>
              )}
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{post.views.toLocaleString()} views</span>
              <div className="ml-auto">
                <ShareButtons title={post.title} url={postUrl} />
              </div>
            </div>

            {/* Sponsored disclosure */}
            {post.sponsored && (
              <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-300">
                <strong>Disclosure:</strong> This is sponsored content. The views expressed are those of the sponsor.
              </div>
            )}

            {/* Content */}
            <div className="prose-custom">
              <p className="lead">{post.excerpt}</p>
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10">
                {post.tags.map(tag => (
                  <span key={tag.id} className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Bottom share */}
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <p className="text-sm text-gray-500">Found this helpful? Share it.</p>
              <ShareButtons title={post.title} url={postUrl} />
            </div>

            {/* Author bio */}
            <div className="mt-10">
              <AuthorBio author={post.author} />
            </div>

            {/* Related articles */}
            {related.length > 0 && (
              <section className="mt-16">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {related.map(r => <ArticleCard key={r.id} post={r} />)}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <AdSlot slotId={process.env.AD_SLOT_SIDEBAR || 'sidebar'} format="rectangle" className="min-h-[250px]" />
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">About the Author</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-200 dark:bg-brand-800 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center">
                  {post.author.name?.[0] ?? 'A'}
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{post.author.name}</p>
                  {post.author.bio && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{post.author.bio}</p>}
                </div>
              </div>
            </div>
            <AdSlot slotId={process.env.AD_SLOT_IN_ARTICLE || 'in-article'} format="rectangle" className="min-h-[250px]" />
          </aside>
        </div>
      </div>
    </>
  )
}
