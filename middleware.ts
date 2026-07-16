import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

function setSecurityHeaders(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  return response
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const token = await getToken({ req, secret })

  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    if (token) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }
    return setSecurityHeaders(NextResponse.next())
  }

  if (!token) {
    const loginUrl = new URL("/admin/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  return setSecurityHeaders(NextResponse.next())
}

export const config = {
  matcher: ["/admin/:path*"],
}
