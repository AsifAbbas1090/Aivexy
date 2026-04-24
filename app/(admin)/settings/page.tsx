export const metadata = { title: 'Settings — Admin' }

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Settings</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">Manage site configuration.</p>

      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Site Identity</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Site Name</label>
              <input
                type="text"
                defaultValue="Aivexy"
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact Email</label>
              <input
                type="email"
                defaultValue="admin@aivexy.com"
                disabled
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Environment Variables</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Configure integrations via your <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs">.env.local</code> file.
          </p>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            {[
              ['DATABASE_URL', 'PostgreSQL connection string'],
              ['NEXTAUTH_SECRET', 'Auth session secret'],
              ['GOOGLE_CLIENT_ID / SECRET', 'Google OAuth'],
              ['GITHUB_CLIENT_ID / SECRET', 'GitHub OAuth'],
              ['STRIPE_SECRET_KEY', 'Stripe payments'],
              ['STRIPE_WEBHOOK_SECRET', 'Stripe webhook signature'],
              ['RESEND_API_KEY', 'Email delivery'],
              ['NEXT_PUBLIC_ADSENSE_CLIENT_ID', 'Google AdSense publisher ID'],
              ['NEXT_PUBLIC_GA_ID', 'Google Analytics measurement ID'],
              ['NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME', 'Cloudinary image hosting'],
            ].map(([key, desc]) => (
              <li key={key} className="flex items-start gap-3">
                <code className="shrink-0 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono text-gray-700 dark:text-gray-300">{key}</code>
                <span className="text-gray-400">{desc}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
