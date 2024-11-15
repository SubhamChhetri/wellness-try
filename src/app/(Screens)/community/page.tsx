import React from 'react'
import GroupCard from '@/app/(Screens)/community/GroupCard'

const Community: React.FC = () => {
    const groups = [
        { title: 'Jangsem Charity', members: 28, socialMedia: 'FB', groupLink: "https://www.facebook.com/groups/MINDFULNESSINDAILYLIFE/", imageUrl: "" },
        { title: 'Clean Bhutan', members: 18, socialMedia: 'Tele', groupLink: "https://chat.whatsapp.com/invite/29rdqvD8uZS8SmBCQV7WmH", imageUrl: "" },
        { title: 'Mental Health Being', members: 48, socialMedia: 'FB', groupLink: "https://www.facebook.com/groups/mhawarenessandsupport/", imageUrl: "" },
    ]
    return (
        <div className="p-4">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Wellness Groups</h2>
                <p className=" font-light text-[#8CA2C0]">Join Our Community</p>
            </div>
            <div className="mt-4">
                {groups.map((group, idx) => (
                    <GroupCard key={idx} group={group} />
                ))}
            </div>
        </div>
    )
}

export default Community
