import { Prisma } from "@prisma/client"
import { NextRequest } from "next/server"

import prisma from "@/lib/prisma"
import { handleError } from "@/utils/handleError"

export async function POST(req: NextRequest) {
  try {
    const { firstName, lastName, email, password } = await req.json()

    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password,
      },
    })

    return new Response(JSON.stringify(user), {
      headers: { "Content-Type": "application/json" },
      status: 201,
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return handleError("Email already in use", 409)
      }
      if (error.code === "42P05") {
        return handleError("A prepared statement already exists. Please try again.", 500)
      }
    }

    return handleError("An unknown error occurred", 500)
  }
}
