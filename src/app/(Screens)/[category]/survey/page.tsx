"use client"
import React, { useEffect, useState } from 'react';
import { Check, CircleAlert, LoaderCircle } from 'lucide-react'; // Make sure you import the icons

import Link from "next/link"

interface Items {
    id: number;
    title: string;
    completed: boolean;
}
// Accept props containing params
const Pending: React.FC<{ params: { category: string } }> = ({ params }) => {
    const { category } = params; // Get the dynamic route parameter
    const [data, setData] = useState([]); // State to hold fetched data
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Only fetch data if category is defined
        if (category) {
            const fetchData = async () => {
                try {
                    const response = await fetch(`/api/surveys/questionnaire/${category}`); // Adjust endpoint as needed
                    const result = await response.json();
                    setData(result); // Set fetched data to state
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

            <div className='flex flex-col space-y-3'>
                {data.length === 0 ? (
                    <div className="text-center p-4 bg-gray-100 rounded-xl">
                        <p className="text-lg text-gray-600">No surveys yet</p>
                    </div>
                ) : (
                    data.map((item: Items) => (
                        <Link href={item.completed ? `#` : `/${category}/survey/${item.title}`} key={item.id}>
                            <div className="flex justify-between items-center bg-gray-100 p-6 rounded-xl">
                                <h4 className="font-bold">
                                    {item.title}
                                    <br />
                                    <span className="font-light text-sm">{data.length} Questions</span>
                                </h4>
                                <span className="text-sm" >
                                    {item.completed ? <Check className="text-green-500" /> : <CircleAlert className='text-yellow-500' />}
                                </span>
                            </div>
                        </Link>
                    ))
                )}
            </div>


        </div>
    )
}

export default Pending
