import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const { token } = req.nextauth
        const pathname = req.nextUrl.pathname

        // Allow access to /auth routes and API without authentication
        if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
            return NextResponse.next()
        }

        // If user is authenticated and tries to access any /auth route, redirect to home
        if (token && pathname.startsWith("/auth")) {
            return NextResponse.redirect(new URL("/", req.url))
        }

        // Require authentication for other routes
        if (!token) {
            return NextResponse.redirect(new URL("/auth/login", req.url))
        }

        // For all other cases, allow the request to proceed
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const pathname = req.nextUrl.pathname
                // Allow access to /auth and /api routes without a token
                if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
                    return true
                }
                // Require a token for all other routes
                return !!token
            },
        },
    }
)

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)", // Ensure API routes are included
        "/auth/:path*",     // Ensure auth routes are included
        "/:path*"           // Catch-all for other routes
    ],
}
