import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Redirige /admin/login vers /login (page unifiée)
    if (req.nextUrl.pathname === '/admin/login') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return NextResponse.next()
  },
  {
    pages: { signIn: "/login" },
  }
)

export const config = { matcher: ["/admin/:path*"] }
