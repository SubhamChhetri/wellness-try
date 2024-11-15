import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description, categoryId, createdBy } = req.body;

    try {
      const questionnaire = await prisma.questionnaire.create({
        data: {
          title,
          description,
          category: { connect: { id: categoryId } },
          createdBy,
        },
      });
      res.status(200).json(questionnaire);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to create questionnaire' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
