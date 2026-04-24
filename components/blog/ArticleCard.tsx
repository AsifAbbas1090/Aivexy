import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Clock, Eye } from 'lucide-react'

interface ArticleCardProps {
  post: {
    slug: string
    title: string
    excerpt?: string | null
    coverImage?: string | null
    publishedAt?: Date | null
    readTime?: number | null
    views: number
    sponsored: boolean
    author: { name?: string | null; image?: string | null }
    category: { name: string; slug: string; color?: string | null }
  }
}

export default function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
      {/* Cover */}
      <Link href={`/blog/${post.slug}`} className="block aspect-[16/9] bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-950 dark:to-brand-900 overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            width={640}
            height={360}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-brand-400 dark:text-brand-600">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
        )}
      </Link>

      <div className="p-5">
        {/* Category + Sponsored */}
        <div className="flex items-center gap-2 mb-3">
          <Link
            href={`/category/${post.category.slug}`}
            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: post.category.color || '#6366f1' }}
          >
            {post.category.name}
          </Link>
          {post.sponsored && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
              Sponsored
            </span>
          )}
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 leading-snug mb-2 line-clamp-2 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{post.excerpt}</p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            {post.author.image ? (
              <img src={post.author.image} alt="" className="w-7 h-7 rounded-full" />
            ) : (
              <div className="w-7 h-7 rounded-full bg-brand-200 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-xs flex items-center justify-center font-semibold">
                {post.author.name?.[0] ?? 'A'}
              </div>
            )}
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{post.author.name}</p>
              {post.publishedAt && (
                <p className="text-xs text-gray-400">{formatDate(post.publishedAt)}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {post.readTime}m
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {post.views.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
