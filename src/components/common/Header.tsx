'use client'
import { useRouter } from 'next/navigation'

import React from 'react'
import { User, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

function formatRoute(route: string | null) {
    if (!route) return '';  // Return an empty string for null

    // Split the string by '/' and get the last part
    const lastPart = route.split('/').pop();

    return lastPart
        ?.replace(/-/g, ' ')                // Replace all hyphens with spaces
        .split(' ')                        // Split the string into an array of words
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
        .join(' ') || '';                  // Join the words back into a string, return empty string if lastPart is null
}


const Header = () => {
    const pathname = usePathname()
    const router = useRouter();

    return (
        <header className="bg-primary text-white p-4 flex justify-center items-center relative">
            {pathname === "/" && (
                <>
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <Link href="/profile" className="absolute right-6">
                        <User className="w-6 h-6" />
                    </Link>
                </>
            )}

            {pathname !== "/" && (
                <>
                    <Link href="" className="absolute left-6" onClick={() => router.back()}
                    >
                        <ChevronLeft />
                    </Link>
                    <h1 className="text-xl font-bold">{formatRoute(pathname)}</h1>
                </>
            )}
        </header>
    )
}

export default Header
