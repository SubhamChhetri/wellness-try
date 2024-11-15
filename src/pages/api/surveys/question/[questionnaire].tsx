import { NextApiRequest, NextApiResponse } from 'next';

// Initialize Prisma Client
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]';

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const session = await getServerSession(req, res, authOptions)

            // Check if the user is authenticated
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" }); // User is not authenticated
            }

            let questionnaire = req.query.questionnaire

            // Ensure questionnaire is a string
            if (Array.isArray(questionnaire)) {
                // If questionnaire is an array, take the first element
                if (questionnaire.length === 0) {
                    return res.status(400).json({ message: "questionnaire cannot be empty" });
                }
                questionnaire = questionnaire[0];
            } else if (typeof questionnaire !== 'string') {
                // If questionnaire is not a string and not an array, return an error
                return res.status(400).json({ message: "Invalid questionnaire format" });
            }
            
            // Fetch questionnaire ID based on questionnaire name
            const QuestionnaireRecord = await prisma.questionnaire.findUnique({
                where: {
                    title: questionnaire,
                },
            });

            if (!QuestionnaireRecord) {
                return res.status(404).json({ message: "Questionnaire not found" });
            }

            // Fetch events using the questionnaire ID
            const questions = await prisma.question.findMany({
                where: {
                    questionnaireId: QuestionnaireRecord.id, // Use the ID of the questionnaire
                }
            });

            // Return success response with events
            return res.status(200).json(questions);
        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ error: "An error occurred while fetching events" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
