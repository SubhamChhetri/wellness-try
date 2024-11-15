// pages/api/category/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const categories = await prisma.category.findMany();
            res.status(200).json(categories);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Failed to retrieve categories' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
