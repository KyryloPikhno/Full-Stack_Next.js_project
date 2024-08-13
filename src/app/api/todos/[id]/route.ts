import { PrismaClient } from "@prisma/client"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "../../../api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the todo by id and userId
    const todo = await prisma.todo.findUnique({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 })
    }

    return NextResponse.json(todo)
  } catch (error) {
    console.error("Error fetching todo:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { body, completed } = await req.json()

    // Update the todo by id and userId
    const updatedTodo = await prisma.todo.update({
      data: { completed, body },
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    return NextResponse.json(updatedTodo)
  } catch (error) {
    console.error("Error updating todo:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      console.log("Unauthorized access attempt.")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Deleting todo with id:", params.id)
    const todo = await prisma.todo.findUnique({
      where: {
        id: params.id, // Assuming id is a string (UUID)
        userId: session.user.id,
      },
    })

    if (!todo) {
      console.log("Todo not found or user is not authorized to delete this todo.")
      return NextResponse.json({ error: "Todo not found or unauthorized" }, { status: 404 })
    }

    await prisma.todo.delete({
      where: { id: todo.id },
    })

    return NextResponse.json({ message: "Todo deleted" })
  } catch (error) {
    console.error("Error during DELETE operation:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
