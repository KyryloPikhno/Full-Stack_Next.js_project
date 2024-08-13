"use client"

import moment from "moment"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

export const DATE_FORMAT_DAY_TIME = "DD HH:mm"

interface ITodo {
  id: string
  body: string
  userId: string
  createdAt: Date
  updatedAt: Date
  completed: boolean
}

const Todos = () => {
  const { data: session, status } = useSession()
  const [todos, setTodos] = useState<ITodo[] | []>([])

  useEffect(() => {
    if (session) {
      fetchTodos()
    }
  }, [session])

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos")
      if (!res.ok) throw new Error("Failed to fetch todos")
      const data = await res.json()
      const sortedTodos = data.sort(
        (a: ITodo, b: ITodo) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
      setTodos(sortedTodos)
    } catch (err) {
      console.log((err as Error).message)
    }
  }

  const addTodo = async (body: string) => {
    const res = await fetch("/api/todos", {
      body: JSON.stringify({ body }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })

    if (res.ok) {
      const newTodoItem = await res.json()
      setTodos([...todos, newTodoItem])
    } else {
      console.error("Failed to add todo")
    }
  }

  const updateTodo = async (id: string, updatedData: any) => {
    await fetch(`/api/todos/${id}`, {
      body: JSON.stringify(updatedData),
      headers: { "Content-Type": "application/json" },
      method: "PATCH",
    })
    fetchTodos()
  }

  const deleteTodo = async (id: string) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setTodos(todos.filter((todo) => todo.id !== id))
      } else {
        const error = await res.json()
        console.error("Failed to delete todo:", error)
      }
    } catch (error) {
      console.error("Error deleting todo:", error)
    }
  }

  const isLoading = status === "loading"

  return (
    <div>
      <h1>Your Todos</h1>
      {!isLoading ? (
        <ul>
          {todos.length ? (
            todos.map((todo) => (
              <li key={todo.id}>
                {todo.body} {todo.completed.toString()}
                {moment(todo?.createdAt).format(DATE_FORMAT_DAY_TIME)}
                {moment(todo?.updatedAt).format(DATE_FORMAT_DAY_TIME)}
                <button className="border" onClick={() => updateTodo(todo.id, { completed: true })}>
                  update
                </button>
                <button className="border" onClick={() => deleteTodo(todo.id)}>
                  Delete
                </button>
              </li>
            ))
          ) : (
            <p>no todos</p>
          )}
        </ul>
      ) : (
        <p>loading</p>
      )}
      <button onClick={() => addTodo("New Todo")}>Add Todo</button>
    </div>
  )
}

export default Todos
