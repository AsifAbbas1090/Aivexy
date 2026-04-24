import Link from 'next/link'

interface CategoryBadgeProps {
  name: string
  slug: string
  color?: string | null
  postCount?: number
}

export default function CategoryBadge({ name, slug, color, postCount }: CategoryBadgeProps) {
  return (
    <Link
      href={`/category/${slug}`}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-md"
      style={{ backgroundColor: color || '#6366f1' }}
    >
      {name}
      {postCount !== undefined && (
        <span className="bg-white/25 px-1.5 py-0.5 rounded-full text-xs">{postCount}</span>
      )}
    </Link>
  )
}
