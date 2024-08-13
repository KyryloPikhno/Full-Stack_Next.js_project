import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import prisma from "@/lib/prisma"
import { handleError } from "@/utils/handleError"

import { authOptions } from "../../api/auth/[...nextauth]/route"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return handleError("Unauthorized", 401)
    }

    const { body } = await req.json()

    const newTodo = await prisma.todo.create({
      data: {
        body,
        completed: false,
        userId: session?.user?.id,
      },
    })

    return NextResponse.json(newTodo, { status: 201 })
  } catch (error) {
    return handleError("Internal Server Error", 500)
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return handleError("Unauthorized", 401)
    }

    const todos = await prisma.todo.findMany({
      where: { userId: session.user.id },
    })

    return NextResponse.json(todos)
  } catch (error) {
    return handleError("Internal Server Error", 500)
  }
}
