import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust this path as necessary

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const session = await getServerSession(req, res, authOptions)

            // Check if the user is authenticated
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" }); // User is not authenticated
            }

            const userId = session.user.id;

            const answeredQuestions = await prisma.answer.findMany({
                where: { userId: userId },
                include: {
                    question: {
                        include: {
                            questionnaire: {
                                include: {
                                    category: true,
                                },
                            },
                        },
                    },
                },
            });

            // 2. Count the number of events of a user
            const eventCount = await prisma.event.count({
                where: { userId: userId },
            });

            // 3. Count the number of moods logged by the user
            const moodCount = await prisma.mood.count({
                where: { userId: userId },
            });

            // 4. Calculate percentage of questions answered by a user to total questions in each category
            const categories = await prisma.category.findMany({
                include: {
                    questionnaires: {
                        include: {
                            questions: true,
                        },
                    },
                },
            });

            const categoryStatistics = categories.map(category => {
                const totalQuestionsInCategory = category.questionnaires.reduce((sum, questionnaire) => {
                    return sum + questionnaire.questions.length;
                }, 0);

                const answeredQuestionsCount = answeredQuestions.filter(answer => {
                    return answer.question.questionnaire.categoryId === category.id;
                }).length;

                const percentageAnswered = totalQuestionsInCategory > 0
                    ? (answeredQuestionsCount / totalQuestionsInCategory) * 100
                    : 0;

                return {
                    categoryId: category.id,
                    categoryName: category.name,
                    totalQuestions: totalQuestionsInCategory,
                    answeredQuestions: answeredQuestionsCount,
                    percentageAnswered,
                };
            });

            const startDate = new Date();
            const endDate = new Date();
            startDate.setDate(endDate.getDate() - 7);

            // Fetch emotions within the last 7 days
            const emotions = await prisma.mood.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                    userId: userId
                },
                select: {
                    createdAt: true,
                    color: true,
                },
            });

            // Define emotionMap with a type to allow indexing by string
            const emotionMap: { [date: string]: string } = {};
            emotions.forEach(emotion => {
                const dateKey = emotion.createdAt.toISOString().split('T')[0]; // Format date as "YYYY-MM-DD"
                emotionMap[dateKey] = emotion.color;
            });

            // Generate the array of colors for the past 7 days
            const streakColors = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(endDate.getDate() - (6 - i)); // Loop from 6 days ago to today
                const dateKey = date.toISOString().split('T')[0];
                return emotionMap[dateKey] || "bg-gray-200"; // Default to "bg-gray-200" if no entry exists
            });

            const userstats = {
                eventCount,
                moodCount,
                categoryStatistics,
                streakColors
            };

            res.status(200).json(userstats);

        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ error: "An error occurred while fetching events" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
