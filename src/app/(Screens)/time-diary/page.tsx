"use client";
import React, { useEffect, useState } from 'react';
import EventCard from '@/app/(Screens)/time-diary/components/EventCard';
import AddEventButton from '@/app/(Screens)/time-diary/components/AddEventButton';
import EventModal from '@/app/(Screens)/time-diary/components/EventModal';

const TimeDiary: React.FC = () => {
    const [events, setEvents] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // ISO format

    // Function to fetch events for the selected date
    const fetchEvents = async (date: string) => {
        try {
            const response = await fetch(`/api/event/getUserEvent?date=${date}`); // Update to your actual API route
            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }
            const data = await response.json();
            setEvents(data.events); // Update events state with fetched data
        } catch (error) {
            console.error(error);
        }
    };

    // Effect to fetch events whenever selectedDate changes
    useEffect(() => {
        fetchEvents(selectedDate);
    }, [selectedDate]);



    // Get today's date
    const today = new Date();
    const days = [];

    for (let i = -2; i <= 2; i++) {
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i); // Adjust the date

        const dayNumber = currentDate.getDate().toString(); // Get day of the month
        const dayLabel = currentDate.toLocaleString('en-US', { weekday: 'short' }).charAt(0); // Get first letter of the day
        const isoDate = currentDate.toISOString().split('T')[0]; // Get ISO date

        days.push({
            day: dayNumber,
            label: dayLabel,
            fullDate: isoDate // Store date as ISO string
        });
    }

    return (
        <div className="p-4">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Today&apos;s</h2>
                <p className="font-light text-[#8CA2C0]">{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>

            {/* Calendar Days */}
            <div className="flex justify-center gap-4 mb-6">
                {days.map((day) => (
                    <button
                        key={day.day}
                        className={`flex flex-col items-center justify-center w-10 h-12 rounded-xl ${selectedDate === day.fullDate
                            ? 'bg-primary text-white'
                            : 'text-gray-800'
                            }`}
                        onClick={() => setSelectedDate(day.fullDate)} // Set full date for the selected date
                    >
                        <span className="text-lg font-bold">{day.day}</span>
                        <span className="text-xs font-light">{day.label}</span>
                    </button>
                ))}
            </div>
            <hr className='mb-6' />

            <div className="space-y-4">
                {events.map((event, idx) => (
                    <EventCard key={idx} event={event} />
                ))}
                {events.length <= 0 &&

                    <div className="text-center p-4 bg-gray-100 rounded-xl">
                        <p className="text-lg text-gray-600">Nothing planned yet!</p>
                    </div>
                }
            </div>
            <div className="fixed mt-4 right-8 bottom-2 mb-4">
                <AddEventButton onClick={() => setModalOpen(true)} />
            </div>

            <EventModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onCreate={() => { }}
            />
        </div>
    );
};

export default TimeDiary;
