'use client'

import React from 'react'
import { Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'



const Header = () => {
    const pathname = usePathname()
    return (
        <div >
            {pathname === "/" && <>
                <footer className="p-4">
                    <Link href="/community">
                        <button className="w-full bg-primary font-semibold  text-white py-3 rounded-2xl flex items-center justify-center">
                            <Users className="w-5 h-5 mr-2 " />
                            Community
                        </button>
                    </Link>
                </footer>
            </>}
        </div>
    )
}

export default Header
