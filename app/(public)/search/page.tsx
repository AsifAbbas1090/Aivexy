import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Search } from 'lucide-react'

export const metadata = { title: 'Search' }

async function searchPosts(q: string) {
  if (!q || q.length < 2) return []
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
  try {
    const res = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(q)}`, { cache: 'no-store' })
    const data = await res.json()
    return data.results || []
  } catch {
    return []
  }
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() || ''
  const results = await searchPosts(q)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Search</h1>

      <form method="GET" className="flex gap-3 mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search articles..."
            autoFocus
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <button type="submit" className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors">
          Search
        </button>
      </form>

      {q && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{q}&rdquo;
        </p>
      )}

      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((r: any) => (
            <Link key={r.id} href={`/blog/${r.slug}`} className="block group p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: r.categoryColor || '#6366f1' }}
                >
                  {r.categoryName}
                </span>
                {r.publishedAt && <span className="text-xs text-gray-400">{formatDate(r.publishedAt)}</span>}
              </div>
              <h2 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors mb-1">
                {r.title}
              </h2>
              {r.excerpt && <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{r.excerpt}</p>}
            </Link>
          ))}
        </div>
      ) : q ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-4 opacity-40" />
          <p className="text-lg font-medium mb-2">No results found</p>
          <p className="text-sm">Try different keywords or <Link href="/blog" className="text-brand-600 hover:underline">browse all articles</Link>.</p>
        </div>
      ) : null}
    </div>
  )
}
