import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust this path as necessary

// Initialize Prisma Client
import prisma from '@/lib/prisma';

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const session = await getServerSession(req, res, authOptions);

            // Check if the session exists (if the user is authenticated)
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" }); // User is not authenticated
            }

            let category = req.query.category;

            // Ensure category is a string
            if (Array.isArray(category)) {
                if (category.length === 0) {
                    return res.status(400).json({ message: "Category cannot be empty" });
                }
                category = category[0];
            } else if (typeof category !== 'string') {
                return res.status(400).json({ message: "Invalid category format" });
            }

            // Fetch category ID based on category name
            const categoryRecord = await prisma.category.findUnique({
                where: { name: category },
            });

            if (!categoryRecord) {
                return res.status(404).json({ message: "Category not found" });
            }

            // Fetch all questionnaires for the category
            const questionnaires = await prisma.questionnaire.findMany({
                where: { categoryId: categoryRecord.id },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    categoryId: true,
                    createdAt: true,
                    createdBy: true,
                    questions: {
                        select: {
                            id: true,
                            answers: {
                                where: {
                                    userId: session.user.id, // Ensure answers are filtered by the current user
                                }
                            }
                        }
                    }
                }
            });

            // Map over the questionnaires to add the 'completed' flag
            const questionnairesWithCompletion = questionnaires.map((questionnaire) => {
                // Check if all questions have been answered by the current user
                const allAnswered = questionnaire.questions.every((question) => question.answers.length > 0);

                return {
                    id: questionnaire.id,
                    title: questionnaire.title,
                    description: questionnaire.description,
                    categoryId: questionnaire.categoryId,
                    createdAt: questionnaire.createdAt,
                    createdBy: questionnaire.createdBy,
                    completed: allAnswered // Set the 'completed' flag
                };
            });

            // Return success response with questionnaires and their completion status
            return res.status(200).json(questionnairesWithCompletion);
        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ error: "An error occurred while fetching the questionnaires" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
