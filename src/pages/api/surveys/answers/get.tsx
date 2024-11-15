// pages/api/answer/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const answers = await prisma.answer.findMany({
        include: { user: true, question: true }, // Include related user and question
      });
      res.status(200).json(answers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve answers' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
