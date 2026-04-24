'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Zap, Search, Menu, X, ChevronDown } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/categories', label: 'Categories' },
  { href: '/guest-post', label: 'Write for Us' },
]

export default function Header() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-200',
        scrolled
          ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm'
          : 'bg-white dark:bg-gray-950'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-brand-700 dark:text-brand-400 font-bold text-xl shrink-0">
            <Zap className="w-6 h-6 fill-current" />
            <span>Aivexy</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/search" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </Link>
            <ThemeToggle />

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="w-7 h-7 rounded-full" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs flex items-center justify-center font-medium">
                      {session.user?.name?.[0] ?? 'A'}
                    </div>
                  )}
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800" onClick={() => setUserDropdown(false)}>
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { setUserDropdown(false); signOut({ callbackUrl: '/' }) }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/signin"
                className="hidden sm:inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Sign In
              </Link>
            )}

            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-800 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {link.label}
              </Link>
            ))}
            {!session && (
              <Link href="/signin" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm font-medium text-brand-600">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
