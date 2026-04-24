import { prisma } from '@/lib/prisma'

export const metadata = { title: 'Payments — Admin' }

export default async function PaymentsPage() {
  const paid = await prisma.guestPost.findMany({
    where: { paid: true },
    orderBy: { submittedAt: 'desc' },
  })

  const tierPrices: Record<string, number> = { BASIC: 99, FEATURED: 199, SPONSORED: 349 }
  const revenue = paid.reduce((sum, p) => sum + (tierPrices[p.tier] ?? 0), 0)

  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Payments</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Total revenue: <span className="font-semibold text-green-600 dark:text-green-400">${revenue.toLocaleString()}</span>
        {' '}from {paid.length} paid submission{paid.length !== 1 ? 's' : ''}
      </p>

      {paid.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              <tr>
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-5 py-3 font-medium">Author</th>
                <th className="text-left px-5 py-3 font-medium">Tier</th>
                <th className="text-right px-5 py-3 font-medium">Amount</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {paid.map(p => (
                <tr key={p.id} className="bg-white dark:bg-gray-950 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-5 py-3 text-gray-900 dark:text-gray-100 max-w-[200px] truncate">{p.title}</td>
                  <td className="px-5 py-3 text-gray-600 dark:text-gray-400">{p.authorName}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300">
                      {p.tier}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                    ${tierPrices[p.tier] ?? 0}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      p.status === 'PUBLISHED'
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 dark:text-gray-400">
                    {new Date(p.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 border border-gray-200 dark:border-gray-800 rounded-2xl">
          <p>No payments received yet.</p>
        </div>
      )}
    </div>
  )
}
