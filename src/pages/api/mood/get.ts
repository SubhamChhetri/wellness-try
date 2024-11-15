import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const session = await getServerSession(req, res, authOptions)

            // Check if the user is authenticated
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" }); // User is not authenticated
            }

            const { month, year } = req.query;
            if (!month || !year) {
                return res.status(400).json({ error: "Month and year are required." });
            }

            // Convert `month` and `year` to numbers
            const monthNumber = Array.isArray(month) ? parseInt(month[0]) : parseInt(month as string);
            const yearNumber = Array.isArray(year) ? parseInt(year[0]) : parseInt(year as string);

            const startDate = new Date(yearNumber, monthNumber - 1, 1); // Start of the month
            const endDate = new Date(yearNumber, monthNumber, 0); // End of the month

            const emotions = await prisma.mood.findMany({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                    userId: session.user.id
                },
                select: {
                    id: true,
                    createdAt: true,
                    state: true,
                    color: true,
                },
            });

            res.status(200).json(emotions);

        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ error: "An error occurred while fetching events" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
