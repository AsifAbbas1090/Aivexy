export default function SearchLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl mb-8" />
      <div className="space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
