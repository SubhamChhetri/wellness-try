import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from '@/lib/prisma';

import bcrypt from "bcryptjs"


// Extend NextAuth types to include username
declare module "next-auth" {
    interface Session {
        user: {
            email: string
            username: string
            id: number
        }
    }
    interface User {
        email: string
        username: string
        id: number
    }
}

export const authOptions: AuthOptions = ({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text" },
                password: { label: "password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findFirst({
                    where: {
                        OR: [
                            { username: credentials?.email },
                            { email: credentials?.email }
                        ]
                    }
                });

                if (!user) {
                    throw new Error('The provided email address is not associated with any account.');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    throw new Error('The entered password is incorrect. Please try again.');
                }

                return { id: user.id, username: user.username, email: user.email }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.name = user.username
                token.email = user.email
            }
            return token
        },
        async session({ session, token }) {
            // Ensure session.user exists and assign values from token
            if (token && session.user) {
                session.user.id = token.id as number
                session.user.username = token.name as string
                session.user.email = token.email as string

            }
            return session
        }
    },
    pages: {
        signIn: '/auth/signin',  // Custom sign-in page if needed
    },
    secret: process.env.NEXTAUTH_SECRET,
})

export default NextAuth(authOptions);
