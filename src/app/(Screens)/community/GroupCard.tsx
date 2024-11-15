import React from 'react'
import { ImageIcon } from "lucide-react"
import Link from 'next/link'
interface GroupCardProps {
    group: {
        title: string
        members: number
        socialMedia: string
        groupLink: string
        imageUrl: string
    }
}

const GroupCard: React.FC<GroupCardProps> = ({ group }) => {
    return (
        <Link href={group.groupLink}>
            <div className="p-2 bg-gray-100 shadow rounded-lg flex items-center justify-between mb-4">
                <div className='flex bg-white w-16 h-16 rounded-full items-center justify-center'>
                    <ImageIcon />

                </div>

                <div className="flex flex-col items-start ">
                    <span className="font-semibold text-md">{group.title}</span>
                    <span className="text-gray-500 font-light text-xs">{group.members} Members</span>
                </div>

                <span>{group.socialMedia}</span>
            </div>
        </Link>
    )
}

export default GroupCard
