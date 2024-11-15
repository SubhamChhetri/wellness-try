"use client";

import { LoaderCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Cell, Pie, PieChart, Legend } from 'recharts';

interface Emotion {
    day: number;
    color: string;
    mood: string;
}

interface Summary {
    color: string;
    value: number;
}

const EmotionLog = () => {
    const [date, setDate] = useState(new Date());
    const [emotions, setEmotions] = useState<Emotion[]>([]);
    const [emotionSummary, setEmotionSummary] = useState<Summary[]>([]);
    const [loadingEmotions, setLoadingEmotions] = useState(true);
    const [loadingSummary, setLoadingSummary] = useState(true);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(() => {
        const fetchEmotions = async () => {
            setLoadingEmotions(true);
            setLoadingSummary(true);
            try {
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const response = await fetch(`/api/mood/get?month=${month}&year=${year}`);
                const data = await response.json();

                // Populate emotions grid
                const daysInMonth = new Date(year, month, 0).getDate();
                const moodDays: Emotion[] = Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const moodData = data.find((item: { createdAt: string }) => new Date(item.createdAt).getDate() === day);
                    return {
                        day,
                        color: moodData ? moodData.color : '#E5E7EB',
                        mood: moodData ? moodData.state : 'None',
                    };
                });
                setEmotions(moodDays);
                setLoadingEmotions(false);

                // Group by unique color and count occurrences
                const colorSummary: Summary[] = data.reduce((acc: Summary[], mood: { color: string }) => {
                    const existing = acc.find(item => item.color === mood.color);
                    if (existing) {
                        existing.value += 1;
                    } else {
                        acc.push({ color: mood.color, value: 1 });
                    }
                    return acc;
                }, []);
                setEmotionSummary(colorSummary);
                setLoadingSummary(false);
            } catch (error) {
                console.error('Error fetching emotions:', error);
                setLoadingEmotions(false);
                setLoadingSummary(false);
            }
        };

        fetchEmotions();
    }, [date]);

    const handlePreviousMonth = () => {
        setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
    };

    return (
        <div className="p-6">
            <h3 className="text-xl font-bold text-center mb-1">{monthNames[date.getMonth()]}</h3>
            <p className="text-center text-sm text-gray-500 mb-6">Your Log for this month</p>

            {/* Emotion Donut Chart with Legend */}
            <div className="flex flex-col items-center mb-6 bg-[#E5E7EB] rounded-2xl p-4">
                {loadingSummary ? (
                    <div className="flex justify-center items-center py-6">
                        <LoaderCircle className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : (
                    <PieChart width={200} height={200}>
                        <Pie
                            data={emotionSummary}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={60}
                            fill="#8884d8"
                        >
                            {emotionSummary.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            formatter={(value, entry) => {
                                const colorEntry = emotionSummary.find(e => e.color === entry.color);
                                return `${colorEntry ? colorEntry.value : 0}`;
                            }}
                        />
                    </PieChart>
                )}
            </div>

            {/* Emotion Log Grid */}
            {loadingEmotions ? (
                <div className="flex justify-center items-center py-6 h-80">
                    <LoaderCircle className="w-10 h-10 text-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-7 gap-4 mb-8">
                    {emotions.map((emotion, i) => (
                        <div
                            key={i}
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-xs"
                            style={{ backgroundColor: emotion.color }}
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

            )}

            {/* Month Navigation */}
            <div className="flex justify-between items-center">
                <button onClick={handlePreviousMonth} className="px-4 py-2 bg-primary text-white rounded-lg">
                    &lt;
                </button>
                <p className="text-lg text-gray-700">{monthNames[date.getMonth()]} {date.getFullYear()}</p>
                <button onClick={handleNextMonth} className="px-4 py-2 bg-primary text-white rounded-lg">
                    &gt;
                </button>
            </div>
        </div>
    );
};

export default EmotionLog;
