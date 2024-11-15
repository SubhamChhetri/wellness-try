"use client";
import React, { useState } from 'react';
import Modal from '@/components/common/Modal'; // Assume Modal is a reusable component
import Link from 'next/link';

const TodaysEmotion = () => {
    const [mood, setMood] = useState('');
    const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
    const [color, setColor] = useState('');
    const [selectedEmoji, setSelectedEmoji] = useState('😌'); // Default emoji

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

    const colors = ['#4CAF50', '#F7DB4F', '#FF5454'];;

    const logMood = async () => {
        if (!mood || !color) {
            alert('Please select both your mood and a color.');
            return;
        }

        try {
            const response = await fetch('/api/mood/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state: mood, color }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(data.message); // Show success message
                // Optionally, reset the mood and color after logging
                setMood('');
                setColor('');
                setSelectedEmoji('😌');
            } else {
                const errorData = await response.json();
                alert(errorData.error || 'An error occurred while logging your mood.');
            }
        } catch (error) {
            console.error('Error logging mood:', error);
            alert('An error occurred while logging your mood.');
        }
    };

    return (
        <>
            <div className="p-6">
                {/* Emoji Display */}
                <div className="flex justify-center mb-4">
                    <span className="text-[130px]">{selectedEmoji}</span>
                </div>

                {/* Mood Selection */}
                <div className="mb-6 text-center">
                    <p className="text-lg font-bold mb-2">How are you feeling Today</p>
                    <div
                        className="w-full py-3 px-4 border border-gray-300 rounded-2xl flex items-center justify-between cursor-pointer"
                        onClick={() => setIsMoodModalOpen(true)}
                    >
                        <span className="text-gray-500">{mood || 'Select your Mood'}</span>
                        <span className="flex space-x-0 text-primary"> &gt;&gt; </span>
                    </div>
                </div>

                {/* Color Selection */}
                <div className="mb-6 text-center">
                    <p className="text-lg font-bold mb-2">Select Color</p>
                    <div className="flex justify-center space-x-6">
                        {colors.map((col) => (
                            <button
                                key={col}
                                onClick={() => setColor(col)}
                                className={`w-20 h-20 rounded-3xl ${color === col ? 'border-8 border-blue-300 ring-2' : 'border-8 border-white ring-2 ring-slate-200'
                                    }`}
                                style={{ backgroundColor: col }}
                            ></button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="fixed bottom-1 mb-4 w-[93%]">

                {/* Log Mood Button */}
                <button
                    className="w-full py-3 bg-primary text-white rounded-lg mb-4 font-semibold"
                    onClick={logMood}
                >
                    Log in Today’s Mood
                </button>

                {/* Emotion Log Button */}
                <Link href="/emotion/emotion-log">
                    <button className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold">
                        Emotion Log
                    </button>
                </Link>
            </div>

            {/* Mood Modal */}
            {isMoodModalOpen && (
                <Modal isOpen={isMoodModalOpen} onClose={() => setIsMoodModalOpen(false)}>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-center ">Emotions</h3>
                        <h3 className="text-sm font-light text-center text-[#8CA2C0] mb-4">Select an emotion Relevant to how you feel</h3>

                        <div className="grid grid-cols-2 gap-4">
                            {emotions.map((emotion) => (
                                <button
                                    key={emotion.label}
                                    onClick={() => {
                                        setMood(emotion.label);
                                        setSelectedEmoji(emotion.emoji);
                                        setIsMoodModalOpen(false);
                                    }}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border ${mood === emotion.label ? 'bg-purple-100 border-primary' : 'border-gray-300'
                                        }`}
                                >
                                    <span className="text-3xl">{emotion.emoji}</span>
                                    <span className="mt-2 text-gray-700">{emotion.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default TodaysEmotion;
