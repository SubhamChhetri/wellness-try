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
            // Destructure validated data
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" }) // User is not authenticated
            }

            const { name, eventType, eventCategory, description, dateTime, mood } = req.body;

            const event = await prisma.event.create({
                data: {
                    name,
                    eventType,
                    description,
                    dateTime: new Date(dateTime), // This should now work with the correct format
                    mood,
                    category: {
                        connect: { id: eventCategory }, // Connects the event to the specified category by its ID
                    },
                    user: {
                        connect: { id: session.user.id }, // Connects the event to the specified user by user ID
                    },
                },
            });

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
