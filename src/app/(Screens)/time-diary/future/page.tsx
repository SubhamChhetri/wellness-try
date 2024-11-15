"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import InputField from '@/components/common/InputField';
import DatePicker from '@/components/common/DatePicker';
import Button from '@/components/common/Button';
import Category from '@/interface/Category';

const AddFutureEvent = () => {
    const [name, setName] = useState('Culture');
    const [description, setDescription] = useState('Showing Compassion to others');
    const [date, setDate] = useState('24/03/24');
    const [category, setCategory] = useState<number | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [categories, setCategories] = useState<Category[]>([]);

    // Fetch categories from the API
    const fetchCategories = async () => {
        try {
            const response = await fetch(`/api/surveys/category/get`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    // Set initial category based on the URL query after categories are fetched
    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        const queryCategory = new URLSearchParams(window.location.search).get('category');
        if (queryCategory && categories.length) {
            const matchingCategory = categories.find(cate => cate.name === queryCategory);
            if (matchingCategory) {
                setCategory(matchingCategory.id);
            }
        }
    }, [categories]); // Runs only when categories change after fetch

    // Handle creating an event
    const handleCreate = async () => {
        setLoading(true);
        const [day, month, year] = date.split('/');
        const formattedDate = `${year}-${month}-${day}`;
        try {
            const eventType = "Future";
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
                    dateTime: formattedDate,
                }),
            });

            if (!res.ok) {
                throw new Error('Failed to create event');
            }

            const data = await res.json();
            alert('Future Event Created: ' + data.message);
            router.back()
        } catch (error) {
            console.error('Error creating event:', error);
            alert('An error occurred while creating the event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="p-6 mb-32">
                <h3 className="text-xl font-bold text-center mb-1">Add Future Event</h3>
                <p className="text-center text-sm text-gray-500 mb-6">Add a Plan to carry out</p>

                <InputField
                    label="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-4"
                />

                <div className="mb-3">
                    <p className="block text-xs font-light text-[#89A6CD] mb-1">Suggestion</p>
                    <div className="flex space-x-2 overflow-x-auto scrollbar-hidden">
                        {categories.map((cate: Category) => (
                            <button
                                key={cate.id}
                                onClick={() => setCategory(cate.id)}
                                className={`px-4 py-2 rounded-full border ${category === cate.id ? 'bg-primary text-white' : 'border-[#89A6CD] text-primary'}`}
                            >
                                {cate.name}
                            </button>
                        ))}
                    </div>
                </div>

                <InputField
                    label="Description"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-4"
                />

                <p className="block text-xs font-light text-[#89A6CD] mb-1">Date and Time</p>
                <DatePicker
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

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
        </div>
    );
};

export default AddFutureEvent;
