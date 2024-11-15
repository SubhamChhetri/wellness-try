import { NextApiRequest, NextApiResponse } from 'next';

import prisma from '@/lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const session = await getServerSession(req, res, authOptions)

            // Check if the user is authenticated
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" }); // User is not authenticated
            }

            // Get the date from query parameters (format YYYY-MM-DD)
            const { date } = req.query;
            // Validate date parameter
            if (!date || Array.isArray(date)) {
                return res.status(400).json({ error: "Invalid date parameter" });
            }

            // Create start and end of the day Date objects
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0); // Set to the start of the day

            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999); // Set to the end of the day

            const events = await prisma.event.findMany({
                where: {
                    userId: session.user.id,  // If `userId` exists as the direct field name
                    dateTime: {
                        gte: startDate,
                        lte: endDate, // Use the end of the day for the range
                    },
                },
                include: {
                    category: true, // Include the related category information
                },
            });
            // Return success response with events
            return res.status(200).json({ events });
        } catch (error) {
            console.error(error); // Log the error for debugging
            return res.status(500).json({ error: "An error occurred while fetching events" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
