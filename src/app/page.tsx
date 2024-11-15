"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

import { LoaderCircle } from 'lucide-react';
import ScoreCard from '@/app/components/ScoreCard';
import CategoryTile from '@/app/components/CategoryTile';
import StreakBar from '@/app/components/StreakBar';
import { useRouter } from "next/navigation";

interface UserStats {
    eventCount: number;
    moodCount: number;
    categoryStatistics: CategoryStatistics[];
    streakColors: string[];
}

interface CategoryStatistics {
    categoryId: string;
    categoryName: string;
    answeredQuestions: number;
    percentageAnswered: number;
}

const Dashboard: React.FC = () => {
    const router = useRouter();

    const [userStats, setUserStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [totalAnsweredQuestions, setTotalAnsweredQuestions] = useState<number | undefined>();
    const [streaks, setStreaks] = useState<string[]>([]);
    
    useEffect(() => {
        const fetchUserStatistics = async () => {
            setLoading(true);  // Set loading to true before starting the fetch
            try {
                const response = await fetch(`/api/home/get`); // Update to your actual API route
                if (!response.ok) {
                    throw new Error('Failed to fetch user statistics');
                }
                const data = await response.json();
                setUserStats(data); // Update userStats state with fetched data
                const totalAnsweredQuestions = data?.categoryStatistics?.reduce((sum: number, category: CategoryStatistics) => sum + category.answeredQuestions, 0);
                setTotalAnsweredQuestions(totalAnsweredQuestions);
                setStreaks(data.streakColors);
                if (data.streakColors[6] === "bg-gray-200") {
                    router.push('/emotion');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false); // Set loading to false once the fetch completes
            }
        };

        fetchUserStatistics();
    }, [router]);  // Include 'router' in the dependency array // No dependency needed here since fetchUserStatistics is defined in the effect itself


    return (
        <div className=''>

            <div className="p-4 mb-4">
                <h1 className="text-2xl text-center font-bold">Your Score</h1>

                {userStats ? (
                    <>
                        <ScoreCard
                            eventCount={userStats?.eventCount}
                            moodCount={userStats?.moodCount}
                            surveyCompleted={totalAnsweredQuestions}
                        />
                        <div className="mt-6">
                            <StreakBar streaks={streaks} />
                        </div>
                    </>
                ) : (
                    <div className="flex justify-center items-center py-6">
                        <LoaderCircle className="w-10 h-10 text-primary animate-spin" />
                    </div>
                )}

            </div>

            <div className="flex justify-between gap-3 items-center">
                <Link href="/time-diary" className="flex-1">
                    <h2 className="text-lg font-bold flex items-center justify-center border w-full py-3 bg-gray-50 text-gray-700 rounded-3xl">
                        <span className="mr-2 text-xl">⏰</span> Time Diary
                    </h2>
                </Link>

                <Link href="/emotion">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
                        <span className="text-2xl">😊</span>
                    </div>
                </Link>
            </div>

            <div className='h-full flex flex-col justify-between'>
                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <LoaderCircle className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : userStats?.categoryStatistics?.length === 0 ? (
                    <div className="mt-44 flex items-center justify-center h-full">
                        <p className="text-gray-500">No data available</p>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-3 gap-4 gap-y-4">
                        {userStats?.categoryStatistics?.map(category => (
                            <CategoryTile
                                key={category.categoryId}
                                category={category.categoryName}
                                streak={category.percentageAnswered}
                            />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
};

export default Dashboard;
