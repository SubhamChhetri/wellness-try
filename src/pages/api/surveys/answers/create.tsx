import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]"; // Adjust this path as necessary

import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {

    try {
      const session = await getServerSession(req, res, authOptions)
      // Destructure validated data
      if (!session) {
        return res.status(401).json({ message: "Unauthorized" }) // User is not authenticated
      }
      const { answers } = req.body;
      // Validate answers structure
      if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: "Invalid input: answers must be a non-empty array." });
      }
      const answerPromises = answers.map(answer => {
        const { id: questionId, mood: answerText } = answer;
        return prisma.answer.create({
          data: {
            answerText,
            userId: session.user.id,
            questionId,
          },
        });
      });

      // Execute all insertions
      await Promise.all(answerPromises);

      res.status(201).json({ message: "Answers submitted successfully." });
    } catch (error) {
      console.error("Error submitting answers:", error);
      res.status(500).json({ error: 'Failed to submit answers.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}