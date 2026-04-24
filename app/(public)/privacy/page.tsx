import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Aivexy collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: April 2025</p>

      <div className="prose-custom space-y-8 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">1. Information We Collect</h2>
          <p>When you create an account, we collect your name and email address via OAuth (Google or GitHub) or direct registration. We do not store your OAuth passwords. If you submit a guest post, we collect the author name, email, and article content you provide.</p>
          <p className="mt-3">We automatically collect standard server logs (IP address, browser user-agent, pages visited, timestamps) for security and analytics purposes.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To authenticate you and provide access to your account</li>
            <li>To process guest post submissions and payments</li>
            <li>To send newsletter emails you have explicitly subscribed to</li>
            <li>To improve site performance and detect abuse</li>
          </ul>
          <p className="mt-3">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">3. Cookies</h2>
          <p>We use session cookies required for authentication. We also use Google Analytics cookies if you have not opted out. You can disable cookies in your browser settings, though this may affect site functionality.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">4. Third-Party Services</h2>
          <p>We use the following third-party services, each with their own privacy policies:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li><strong>Stripe</strong> — payment processing for guest post submissions</li>
            <li><strong>Resend</strong> — transactional email delivery</li>
            <li><strong>Google Analytics</strong> — anonymous site traffic analytics</li>
            <li><strong>Google AdSense</strong> — advertising (uses cookies for ad personalization)</li>
            <li><strong>Cloudinary</strong> — image hosting and optimization</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">5. Data Retention</h2>
          <p>Account data is retained until you delete your account. Newsletter subscriptions are retained until you unsubscribe. Guest post submissions are retained for our editorial records.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">6. Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data by contacting us at <a href="mailto:admin@aivexy.com" className="text-brand-600 dark:text-brand-400 hover:underline">admin@aivexy.com</a>.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">7. Contact</h2>
          <p>For privacy-related inquiries, contact us at <a href="mailto:admin@aivexy.com" className="text-brand-600 dark:text-brand-400 hover:underline">admin@aivexy.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
