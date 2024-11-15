
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from 'next';
import { z, ZodError, ZodIssueCode } from 'zod';

// Initialize Prisma Client
import prisma from '@/lib/prisma';

// Define the Zod schema for validation
const userSchema = z.object({
    username: z.string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[!@#$%^&*]/, { message: "Password must contain at least one special character" }),
    email: z.string()
        .email({ message: "Invalid email format" }),
}).refine(async (data) => {
    // Check for existing user
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { username: data.username },
                { email: data.email }
            ]
        }
    });

    // If an existing user is found, return false
    if (existingUser) {
        const errors: z.ZodIssue[] = []; // Correctly define the error array as ZodIssue type
        if (existingUser.username === data.username) {
            errors.push({
                path: ["username"],
                message: "Username already exists",
                code: ZodIssueCode.custom, // Use ZodIssueCode.custom for the code
            });
        }
        if (existingUser.email === data.email) {
            errors.push({
                path: ["email"],
                message: "Email already exists",
                code: ZodIssueCode.custom, // Use ZodIssueCode.custom for the code
            });
        }
        throw new ZodError(errors); // Throw the ZodError with the issues
    }

    return true; // Validation passed
});

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            console.log(req.body)

            // Parse and validate user data using Zod
            const parsedData = await userSchema.parseAsync(req.body); // Throws if validation fails
            // Destructure validated data
            const { username, password, email } = parsedData;

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = await prisma.user.create({
                data: {
                    username,
                    password: hashedPassword,
                    email,
                },
            });
            // Return success response
            return res.status(201).json({ message: "User created successfully", userId: user.id });
        } catch (error) {
            if (error instanceof ZodError) {
                // Format Zod validation errors
                const formattedErrors = error.errors.reduce((acc, { path, message }) => {
                    acc[path.join('.')] = message; // Join path array to create a dot notation key
                    return acc;
                }, {} as Record<string, string>);

                return res.status(400).json({ errors: formattedErrors });
            }
            console.error("Registration error:", error);
            return res.status(500).json({ error: "An error occurred during registration" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
