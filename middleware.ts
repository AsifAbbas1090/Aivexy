import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Admin-only paths
    const isAdminPath = path.startsWith('/dashboard') || path.startsWith('/admin')
    if (isAdminPath && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/signin', req.url))
    }

    // Admin API
    if (path.startsWith('/api/admin') && token?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/api/admin/:path*'],
}
