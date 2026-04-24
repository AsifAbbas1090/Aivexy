import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms and conditions for using Aivexy.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: April 2025</p>

      <div className="prose-custom space-y-8 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing or using Aivexy, you agree to be bound by these Terms of Service. If you do not agree, please do not use the site.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">2. Use of the Site</h2>
          <p>You agree to use Aivexy only for lawful purposes. You must not:</p>
          <ul className="list-disc pl-5 space-y-2 mt-3">
            <li>Post content that is defamatory, obscene, or violates any third-party rights</li>
            <li>Attempt to gain unauthorized access to any part of the site</li>
            <li>Use automated tools to scrape or harvest content without permission</li>
            <li>Submit guest posts containing plagiarized or misleading content</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">3. Guest Post Submissions</h2>
          <p>By submitting a guest post, you represent that the content is original and that you have the right to publish it. You grant Aivexy a non-exclusive license to publish, edit, and promote the submitted content. Payments are non-refundable once a submission is approved for publication.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">4. Intellectual Property</h2>
          <p>All original content published on Aivexy (excluding guest posts and user-submitted content) is owned by Aivexy and protected by copyright. You may share links to our articles but may not reproduce full articles without permission.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">5. Disclaimers</h2>
          <p>Content on Aivexy is provided for informational purposes only and does not constitute professional advice. We make no warranties about the accuracy or completeness of any content. AI-assisted content is clearly disclosed where applicable.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">6. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Aivexy is not liable for any indirect, incidental, or consequential damages arising from your use of the site.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">7. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of the site after changes constitutes acceptance of the updated terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">8. Contact</h2>
          <p>Questions about these terms? Email <a href="mailto:admin@aivexy.com" className="text-brand-600 dark:text-brand-400 hover:underline">admin@aivexy.com</a>.</p>
        </section>
      </div>
    </div>
  )
}
