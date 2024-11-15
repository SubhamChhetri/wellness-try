// pages/api/questionnaire/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const questionnaires = await prisma.questionnaire.findMany({
        include: { category: true }, // Include related category
      });
      res.status(200).json(questionnaires);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to retrieve questionnaires' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
