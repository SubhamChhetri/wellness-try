import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust this path as necessary

// Initialize Prisma Client
import prisma from '@/lib/prisma';

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const session = await getServerSession(req, res, authOptions)

            // Check if the user is authenticated
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" }); // User is not authenticated
            }

            let category = req.query.category;

            // Ensure category is a string
            if (Array.isArray(category)) {
                // If category is an array, take the first element
                if (category.length === 0) {
                    return res.status(400).json({ message: "Category cannot be empty" });
                }
                category = category[0];
            } else if (typeof category !== 'string') {
                // If category is not a string and not an array, return an error
                return res.status(400).json({ message: "Invalid category format" });
            }

            // Fetch category ID based on category name
            const categoryRecord = await prisma.category.findUnique({
                where: {
                    name: category,
                },
            });

            if (!categoryRecord) {
                return res.status(404).json({ message: "Category not found" });
            }

            // Fetch events using the category ID
            const events = await prisma.event.findMany({
                where: {
                    userId: session.user.id,
                    eventCategory: categoryRecord.id, // Use the ID of the category
                }
            });

            // Check if any questionnaire in this category has unanswered questions by the user
            const questionnaires = await prisma.questionnaire.findMany({
                where: {
                    categoryId: categoryRecord.id,
                },
                include: {
                    questions: {
                        include: {
                            answers: {
                                where: {
                                    userId: session.user.id, // Only consider answers by the specific user
                                },
                            },
                        },
                    },
                },
            });
            // If there are no questions in the category, return null for pending survey status
            if (questionnaires.every((questionnaire) => questionnaire.questions.length === 0)) {
                return res.status(200).json({ events, hasPendingSurveys: null });
            }

            // Check if any questionnaire in this category has unanswered questions by the user
            const hasPendingSurveys = questionnaires.some((questionnaire) =>
                questionnaire.questions.some((question) =>
                    question.answers.length === 0 // Check if any question has no answers by this user
                )
            );




            // Return success response with events
            return res.status(200).json({ events, hasPendingSurveys, questionnaires });
        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ error: "An error occurred while fetching events" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
