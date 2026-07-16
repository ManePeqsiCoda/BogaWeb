import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export const proxy = auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isLoginPage = nextUrl.pathname === '/admin/login'

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = new URL('/admin/login', nextUrl.origin)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*'],
}
