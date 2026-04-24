import { AtSign, Globe } from 'lucide-react'

interface AuthorBioProps {
  author: {
    name?: string | null
    image?: string | null
    bio?: string | null
    twitter?: string | null
    website?: string | null
  }
}

export default function AuthorBio({ author }: AuthorBioProps) {
  return (
    <div className="flex items-start gap-5 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
      {author.image ? (
        <img src={author.image} alt={author.name ?? ''} className="w-16 h-16 rounded-full shrink-0" />
      ) : (
        <div className="w-16 h-16 rounded-full bg-brand-200 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-2xl font-bold flex items-center justify-center shrink-0">
          {author.name?.[0] ?? 'A'}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Written by</p>
        <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{author.name}</p>
        {author.bio && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{author.bio}</p>
        )}
        <div className="flex items-center gap-3 mt-3">
          {author.twitter && (
            <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-600 transition-colors" aria-label="Twitter">
              <AtSign className="w-4 h-4" />
            </a>
          )}
          {author.website && (
            <a href={author.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-brand-600 transition-colors" aria-label="Website">
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
