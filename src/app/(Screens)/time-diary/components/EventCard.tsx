import React from 'react'

interface EventCardProps {
    event: {
        category: {
            name: string
        }
        description: string
        dateTime: string
    }
}
const EventCard: React.FC<EventCardProps> = ({ event }) => {
    // Parse the date from the event
    const eventDate = new Date(event.dateTime);

    // Format the date and time
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(eventDate);

    return (
        <div className="flex justify-between items-center bg-gray-100 p-6 rounded-xl">
            <h4 className="font-bold">{event.category.name}</h4>
            {/* <span className="text-sm text-center text-gray-500 px-3">{event.description}</span> */}
            <span className="text-sm text-gray-500">{formattedDate}</span>
        </div>
    )
}

export default EventCard;
