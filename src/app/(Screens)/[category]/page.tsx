"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CircleAlert, CircleX, ClipboardCheck, LoaderCircle, Plus } from 'lucide-react';

interface Items {
    id: number;
    name: string;
    description: string,
    dateTime: Date
}

// Accept props containing params
const Category: React.FC<{ params: { category: string } }> = ({ params }) => {
    const { category } = params; // Get the dynamic route parameter
    const [data, setData] = useState([]); // State to hold fetched data
    const [loading, setLoading] = useState(true); // Loading state
    const [hasPendingSurveys, setHasPendingSurveys] = useState();

    function formatDate(date: Date) {
        return new Intl.DateTimeFormat('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(date);
    }

    useEffect(() => {
        // Only fetch data if category is defined
        if (category) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`/api/event/${category}`); // Adjust endpoint as needed
                    const result = await response.json();
                    setData(result.events); // Set fetched data to state
                    setHasPendingSurveys(result.hasPendingSurveys);

                } catch (error) {
                    console.error('Error fetching data:', error);
                } finally {
                    setLoading(false); // Set loading to false
                }
            };

            fetchData();
        }
    }, [category]); // Dependency array to re-fetch data when category changes

    if (loading) return <div className="flex h-screen items-center justify-center">
        <div className="text-center">
            <LoaderCircle className="w-14 h-14 text-primary animate-spin" />
        </div>
    </div>; // Show loading indicator
    return (
        <div className="p-4">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{category}</h2>
                <p className=" font-light text-[#8CA2C0]">Complete Surveys and Set Goals</p>
            </div>
            <Link
                href={hasPendingSurveys === null ? "#" : `/${category}/survey/`}
                className={`flex-1 ${hasPendingSurveys === null ? 'cursor-not-allowed opacity-50' : ''}`}
            >
                <h2 className="text-lg font-bold flex items-center justify-center border w-full py-3 bg-gray-50 text-gray-700 rounded-3xl">
                    <span className="w-10">
                        {hasPendingSurveys === null ? (
                            <CircleX className="text-red-500" />
                        ) : hasPendingSurveys ? (
                            <CircleAlert className="text-yellow-500" />
                        ) : (
                            <ClipboardCheck className="text-green-500" />
                        )}
                    </span>
                    {hasPendingSurveys === null ? 'No surveys yet' : (hasPendingSurveys ? 'Pending' : 'Completed')}
                </h2>
            </Link>

            <hr className='my-6' />

            <div className='flex-col space-y-3'>
                {data.map((item: Items) => (
                    <div key={item.id} >
                        <div className="flex justify-between items-center bg-gray-100 p-6 rounded-xl">
                            <h4 className="font-bold">{item.name}<br />
                                <span className='font-light text-sm'>{item.description}</span>
                            </h4>
                            <span className="text-sm text-gray-500">{formatDate(new Date(item.dateTime))} </span>
                        </div>
                    </div>
                ))}

            </div>

            <Link href={`/time-diary/future?category=${category}`} >
                <div className="flex justify-between items-center bg-gray-100 p-6 mt-3 rounded-xl">
                    <h4 className="font-bold">Add {category} <br />
                        <span className='font-light text-sm'>Set goal</span>
                    </h4>
                    <span className="text-sm text-gray-500"><Plus /> </span>
                </div>
            </Link>
        </div>
    );
};

export default Category;
