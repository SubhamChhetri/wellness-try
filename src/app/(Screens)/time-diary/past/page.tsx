"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import InputField from '@/components/common/InputField';
import DatePicker from '@/components/common/DatePicker';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

import Category from '@/interface/Category';


const AddPastEvent = () => {
    const [name, setName] = useState('Culture');
    const [description, setDescription] = useState('Showing Compassion to others');
    const [date, setDate] = useState('24/03/24');
    const [category, setCategory] = useState<number>();
    const [mood, setMood] = useState(''); // For storing the selected mood
    const [isMoodModalOpen, setIsMoodModalOpen] = useState(false); // To toggle the modal visibility
    const [loading, setLoading] = useState(false); // To manage loading state
    const router = useRouter();

    const [categories, setCategories] = useState([]);

    const emotions = [
        { emoji: '😡', label: 'Angry' },
        { emoji: '😓', label: 'Guilt' },
        { emoji: '🤐', label: 'Selfish' },
        { emoji: '😑', label: 'Jealousy' },
        { emoji: '😌', label: 'Pride' },
        { emoji: '😌', label: 'Calmness' },
        { emoji: '🥺', label: 'Empathy' },
        { emoji: '😇', label: 'Forgiving' },
        { emoji: '😌', label: 'Content' },
        { emoji: '😇', label: 'Generosity' },
    ];

    const handleCreate = async () => {
        setLoading(true);
        const [day, month, year] = date.split('/');
        const formattedDate = `${year}-${month}-${day}`;
        try {
            const eventType = "Past"; // Set event type to Past
            const res = await fetch('/api/event/postUserEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    eventType,
                    eventCategory: category,
                    description,
                    mood,
                    dateTime: formattedDate,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to create event');
            }

            const data = await res.json();
            alert('Past Event Created: ' + data.message);
            router.push('/time-diary'); // Redirect after creation
        } catch (error) {
            console.error('Error creating event:', error);
            alert('An error occurred while creating the event');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(`/api/surveys/category/get`); // Update to your actual API route
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data); // Update Categories state with fetched data
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div>
            <div className="p-6">
                <h3 className="text-xl font-bold text-center mb-1">Add Past Event</h3>
                <p className="text-center text-sm text-gray-500 mb-6">Recollect an experience</p>

                {/* Event Name */}
                <InputField
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-4"
                />

                {/* Suggestions */}
                <div className="mb-3">
                    <p className="block text-xs font-light text-[#89A6CD] mb-1">Suggestion</p>
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hidden">
                        {categories.map((cate: Category) => (
                            <button
                                key={cate.id}
                                onClick={() =>
                                    setCategory(cate.id)
                                }
                                className={`px-4 py-2 rounded-full border ${category === cate.id ? 'bg-primary text-white' : 'border-[#89A6CD] text-primary'}`}
                            >
                                {cate.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <InputField
                    label="Description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-3"
                />

                {/* Date and Time */}
                <p className="block text-xs font-light text-[#89A6CD] mb-1">Date and Time</p>
                <DatePicker
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                {/* Mood Selection */}
                <div className="mb-6 mt-8">
                    <div
                        className="w-full py-3 px-4 border border-gray-300 rounded-lg flex items-center justify-between cursor-pointer"
                        onClick={() => setIsMoodModalOpen(true)}
                    >
                        <span className="text-gray-500">{mood || 'Select your Mood'}</span>
                        <span className="text-primary"> &gt; </span>
                    </div>
                </div>
            </div>

            {/* Create Event Button */}
            <div className="fixed bottom-1 mb-4 w-[93%]">
                <Button
                    text={loading ? "Creating..." : "Create Event"}
                    onClick={handleCreate}
                    className="w-full py-3 bg-primary text-white font-bold rounded-2xl mb-4"
                    disabled={loading}
                />
                <Link href="" onClick={() => router.back()}>
                    <button className="w-full py-3 bg-gray-100 font-bold text-gray-700 rounded-2xl border">Cancel</button>
                </Link>
            </div>

            {/* Mood Modal */}
            {isMoodModalOpen && (
                <Modal isOpen={isMoodModalOpen} onClose={() => setIsMoodModalOpen(false)}>
                    <div className="">
                        <h3 className="text-xl font-bold text-center mb-4">Emotions</h3>
                        <p className="text-center text-sm text-gray-500 mb-6">Select an emotion relevant to how you feel</p>
                        <div className="grid grid-cols-3 gap-4">
                            {emotions.map((emotion) => (
                                <button
                                    key={emotion.label}
                                    onClick={() => {
                                        setMood(emotion.label);
                                        setIsMoodModalOpen(false);
                                    }}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg border ${mood === emotion.label ? 'bg-purple-100 border-primary' : 'border-gray-300'
                                        }`}
                                >
                                    <span className="text-3xl">{emotion.emoji}</span>
                                    <span className="mt-2 text-gray-700 text-xs">{emotion.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AddPastEvent;
