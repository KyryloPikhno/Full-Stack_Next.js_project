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

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const filter = url.searchParams.get("filter") || "All"

    const whereClause: any = { userId: session.user.id }

    if (filter === "Completed") {
      whereClause.completed = true
    } else if (filter === "Active") {
      whereClause.completed = false
    }

    const todos = await prisma.todo.findMany({
      orderBy: {
        createdAt: "asc",
      },
      where: whereClause,
    })

    return NextResponse.json(todos)
  } catch (error) {
    console.log("error", error)
    return handleError("Internal Server Error", 500)
  }
}

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return handleError("Unauthorized", 401)
    }

    const result = await prisma.$transaction(async (prisma) => {
      const todos = await prisma.todo.findMany({
        where: { userId: session.user?.id },
      })

      const allCompleted = todos.every((todo) => todo.completed)

      await prisma.todo.updateMany({
        data: { completed: !allCompleted },
        where: { userId: session.user?.id },
      })

      return prisma.todo.findMany({
        where: { userId: session.user?.id },
      })
    })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    return handleError("Internal Server Error", 500)
  }
}
