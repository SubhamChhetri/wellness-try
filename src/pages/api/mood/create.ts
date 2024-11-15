import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust this path as necessary

// Initialize Prisma Client
import prisma from '@/lib/prisma';

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {

            const session = await getServerSession(req, res, authOptions)

            if (!session) {
                return res.status(401).json({ message: "Unauthorized" }) // User is not authenticated
            }

            const { state, color } = req.body;
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            // Check if there is an existing mood entry for the user today
            const existingMood = await prisma.mood.findFirst({
                where: {
                    userId: session.user.id,
                    createdAt: {
                        gte: startOfDay,
                        lte: endOfDay,
                    },
                },
            });

            let event;
            if (existingMood) {
                // Update the existing entry
                event = await prisma.mood.update({
                    where: { id: existingMood.id },
                    data: { state, color },
                });
            } else {
                // Create a new entry
                event = await prisma.mood.create({
                    data: {
                        state,
                        color,
                        user: { connect: { id: session.user.id } },
                        createdAt: new Date(),
                    },
                });
            }

            // Return success response
            return res.status(201).json({ message: "Event created successfully", event });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: "An error occurred during registration" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
