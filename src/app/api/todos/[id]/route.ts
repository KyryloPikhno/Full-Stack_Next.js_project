import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import prisma from "@/lib/prisma"
import { handleError } from "@/utils/handleError"

import { authOptions } from "../../../api/auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return handleError("Unauthorized", 401)
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id: params.id,
        userId: session?.user?.id,
      },
    })

    if (!todo) {
      return handleError("Todo not found", 404)
    }

    return NextResponse.json(todo)
  } catch (error) {
    return handleError("Internal Server Error", 500)
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return handleError("Unauthorized", 401)
    }

    const { body, completed } = await req.json()

    const updatedTodo = await prisma.todo.update({
      data: { body, completed },
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(updatedTodo)
  } catch (error) {
    return handleError("Internal Server Error", 500)
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return handleError("Unauthorized", 401)
    }

    const todo = await prisma.todo.findUnique({
      where: {
        id: params.id,
        userId: session?.user?.id ?? "",
      },
    })

    if (!todo) {
      return handleError("Todo not found or unauthorized", 404)
    }

    await prisma.todo.delete({
      where: { id: todo.id },
    })

    return NextResponse.json({ message: "Todo deleted" })
  } catch (error) {
    return handleError("Internal Server Error", 500)
  }
}
