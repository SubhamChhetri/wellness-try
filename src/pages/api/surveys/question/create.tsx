import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { questionText, questionType, questionnaireId, image } = req.body;

    try {
      const question = await prisma.question.create({
        data: {
          questionText,
          questionType,
          questionnaire: { connect: { id: questionnaireId } },
          image: image || '', // Provide an empty string or default URL if `image` is not provided,
        },
      });
      res.status(200).json(question);
    } catch (error) {
      console.log(error)

      res.status(500).json({ error: 'Failed to create question' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
