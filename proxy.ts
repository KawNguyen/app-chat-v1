import { NextRequest, NextResponse } from "next/server"

const ACCESS_COOKIE = process.env.NODE_ENV === "production" ? "__Host-at" : "at"

const AUTH_ROUTES = ["/signin", "/signup"]
const PROTECTED_ROUTES = ["/", "/chat"]

function matchesRoute(pathname: string, routes: string[]) {
  return routes.some(
    (route) =>
      pathname === route || (route !== "/" && pathname.startsWith(`${route}/`))
  )
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const hasAccessCookie = request.cookies.has(ACCESS_COOKIE)
  const isAuthRoute = matchesRoute(pathname, AUTH_ROUTES)
  const isProtectedRoute = matchesRoute(pathname, PROTECTED_ROUTES)

  if (isProtectedRoute && !hasAccessCookie) {
    const signInUrl = new URL("/signin", request.url)

    signInUrl.searchParams.set("callbackUrl", `${pathname}${search}`)

    return NextResponse.redirect(signInUrl)
  }

  if (isAuthRoute && hasAccessCookie) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/signin", "/signup", "/chat/:path*"],
}
