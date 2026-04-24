export default function DashboardLoading() {
  return (
    <div className="p-8 animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-48 mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
    </div>
  )
}
