import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import prisma from "@/lib/prisma"

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.lastName = user.lastName
        token.firstName = user.firstName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          email: token.email as string,
          firstName: token.firstName as string,
          id: token.id as string,
          lastName: token.lastName as string,
        }
      }
      return session
    },
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email || "" },
          })

          if (!user) {
            throw new Error("No user found with the given email")
          }

          if (!credentials?.password || !bcrypt.compareSync(credentials.password, user.password)) {
            throw new Error("Invalid password")
          }

          return user
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message)
          }
          throw new Error("An unknown error occurred")
        }
      },
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      name: "Credentials",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
}

export { authOptions }

export const GET = NextAuth(authOptions)
export const POST = NextAuth(authOptions)
