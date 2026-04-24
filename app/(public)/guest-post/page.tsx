import Link from 'next/link'
import { CheckCircle2, Star, Zap, TrendingUp, ChevronDown } from 'lucide-react'

export const metadata = {
  title: 'Write for Us — Guest Post',
  description: 'Submit a guest post on Aivexy and reach thousands of AI and writing professionals.',
}

const tiers = [
  {
    name: 'Basic',
    price: 49,
    tier: 'BASIC',
    color: 'border-gray-200 dark:border-gray-700',
    badge: null,
    description: 'Perfect for establishing your voice in the AI writing space.',
    features: [
      'Published within 7 business days',
      'Do-follow backlink to your site',
      'Author bio with photo',
      'Permanent placement in blog',
      'Social share on our channels',
    ],
  },
  {
    name: 'Featured',
    price: 99,
    tier: 'FEATURED',
    color: 'border-brand-500 ring-2 ring-brand-500',
    badge: 'Most Popular',
    description: 'Maximum visibility with homepage spotlight.',
    features: [
      'Everything in Basic',
      'Homepage feature for 48 hours',
      'Newsletter mention (5k+ subscribers)',
      'Priority review (3 business days)',
      'Social amplification package',
    ],
  },
  {
    name: 'Sponsored',
    price: 199,
    tier: 'SPONSORED',
    color: 'border-amber-400 dark:border-amber-600',
    badge: 'Premium',
    description: 'Full sponsorship package for maximum brand exposure.',
    features: [
      'Everything in Featured',
      'Sponsored badge (clearly disclosed)',
      'Dedicated newsletter section',
      'Guaranteed same-week publish',
      'Sticky sidebar placement (7 days)',
      'Performance report after 30 days',
    ],
  },
]

const faqs = [
  { q: 'What topics do you accept?', a: 'We focus on AI tools, writing productivity, prompt engineering, content monetization, and SEO for bloggers. Submissions outside these areas may be declined.' },
  { q: 'What is the minimum article length?', a: 'We require a minimum of 800 words. Articles between 1,200–2,000 words perform best on our platform.' },
  { q: 'Do I keep ownership of my content?', a: 'You retain copyright, but grant Aivexy a perpetual license to publish and distribute the content.' },
  { q: 'What is your refund policy?', a: 'Full refund if your submission is declined before review begins. Once editorial review starts, refunds are not available.' },
  { q: 'Can I include links in my article?', a: 'One do-follow link to your own site is included. Additional promotional links are not permitted.' },
]

export default function GuestPostPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 text-sm font-medium mb-6">
          <TrendingUp className="w-4 h-4" />
          Write for 10,000+ monthly readers
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
          Share Your AI Writing Expertise
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Get your article in front of bloggers, content creators, and AI enthusiasts. Build backlinks, grow your audience, and establish authority.
        </p>
      </div>

      {/* Pricing tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        {tiers.map(tier => (
          <div key={tier.tier} className={`relative bg-white dark:bg-gray-900 rounded-2xl border ${tier.color} p-8 flex flex-col`}>
            {tier.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-brand-600 text-white text-xs font-bold rounded-full">{tier.badge}</span>
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{tier.name}</h3>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">${tier.price}</span>
              <span className="text-gray-400 mb-1">per article</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{tier.description}</p>
            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/guest-post/submit?tier=${tier.tier}`}
              className={`block text-center px-6 py-3 rounded-xl font-semibold text-sm transition-colors ${
                tier.tier === 'FEATURED'
                  ? 'bg-brand-600 hover:bg-brand-700 text-white'
                  : 'border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              Submit Article
            </Link>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-20 text-center">
        {[
          { value: '10k+', label: 'Monthly Readers' },
          { value: '2.4k+', label: 'Newsletter Subs' },
          { value: '4.2%', label: 'Avg. CTR' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <p className="text-3xl font-extrabold text-brand-700 dark:text-brand-400">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map(faq => (
            <details key={faq.q} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
              <summary className="flex items-center justify-between cursor-pointer font-medium text-gray-900 dark:text-gray-100 list-none">
                {faq.q}
                <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" />
              </summary>
              <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-12 text-white">
        <Zap className="w-10 h-10 mx-auto mb-4 fill-current text-brand-300" />
        <h2 className="text-3xl font-bold mb-4">Ready to share your expertise?</h2>
        <p className="text-brand-200 mb-8">Join dozens of AI writers who have grown their audience through Aivexy.</p>
        <Link href="/guest-post/submit" className="inline-block px-8 py-4 bg-white text-brand-900 rounded-xl font-bold hover:bg-gray-100 transition-colors">
          Submit Your Article
        </Link>
      </div>
    </div>
  )
}
