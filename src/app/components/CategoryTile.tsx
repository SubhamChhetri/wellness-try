import React from 'react'
import Link from 'next/link'

import { Grid2x2Plus } from 'lucide-react'

interface CategoryTileProps {
    category: string
    streak: number
}

const CategoryTile: React.FC<CategoryTileProps> = ({ category, streak }) => {

    const normalizedStreak = streak > 100 ? 100 : streak; // Cap the streak at 100

    return (
        <Link href={"/" + category}>

            <div className="text-center cursor-pointer bg-gray-100 shadow rounded-xl h-28 flex flex-col justify-center items-center">
                <div className="relative  w-14 h-14 mx-auto mb-2">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle
                            cx="18"
                            cy="18"
                            r="15.5"
                            strokeWidth="2"
                            stroke="gray"
                            fill="none"
                        />
                        <circle
                            cx="18"
                            cy="18"
                            r="15.5"
                            strokeWidth="2"
                            stroke={streak < 20 ? 'red' : 'green'}
                            fill="none"
                            strokeDasharray="97.5"
                            strokeDashoffset={97.5 - (normalizedStreak * 97.5) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-300 ease-out"
                        />
                    </svg>
                    <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <span className="text-xl"><Grid2x2Plus /></span>
                    </div>
                </div>
                <p className="text-xs text-gray-600">{category}</p>
            </div>
        </Link>
    )
}

export default CategoryTile
