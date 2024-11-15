// pages/api/question/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const questions = await prisma.question.findMany({
                include: {
                    questionnaire: {
                        include: {
                            category: true, // Include related categories
                        },
                    },
                },
            });
            res.status(200).json(questions);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve questions' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
