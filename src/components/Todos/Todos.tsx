"use client"

import { Button, Separator } from "@radix-ui/themes"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

import { ITodo } from "@/interfaces"

import Todo from "../Todo/Todo"

enum STATUS {
  ALL = "All",
  Active = "Active",
  Completed = "Completed",
}

const Todos = () => {
  const { data: session, status } = useSession()

  const [filteredTodos, setFilteredTodos] = useState<ITodo[] | []>([])
  const [filter, setFilter] = useState<STATUS>(STATUS.ALL)
  const [todos, setTodos] = useState<ITodo[] | []>([])

  useEffect(() => {
    if (session) {
      fetchTodos()
    }
  }, [session])

  useEffect(() => {
    if (filter === STATUS.Completed) {
      setFilteredTodos(todos.filter((todo) => todo.completed))
    } else if (filter === STATUS.Active) {
      setFilteredTodos(todos.filter((todo) => !todo.completed))
    } else {
      setFilteredTodos(todos)
    }
  }, [filter, todos])

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos")
      if (!res.ok) throw new Error("Failed to fetch todos")
      const data = await res.json()
      setTodos(data)
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
    try {
      const res = await fetch(`/api/todos/${id}`, {
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
        method: "PATCH",
      })

      if (!res.ok) {
        throw new Error("Failed to update todo")
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === id ? { ...todo, ...updatedData } : todo)),
      )
    } catch (error) {
      console.error("Error updating todo:", error)
    }
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
    <div className="p-4 min-h-[80vh] mb-20">
      <h1 className="text-[30px] font-bold mb-4 text-center">Your Todos</h1>
      <div className="flex justify-between mb-4 w-[500px]">
        <Button
          className="bg-[#000000] text-white px-4 py-2 rounded-md hover:bg-[#3c3b3b] transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setFilter(STATUS.ALL)}
        >
          {STATUS.ALL}
        </Button>
        <Button
          className="bg-[#000000] text-white px-4 py-2 rounded-md hover:bg-[#3c3b3b] transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setFilter(STATUS.Completed)}
        >
          {STATUS.Completed}
        </Button>
        <Button
          className="bg-[#000000] text-white px-4 py-2 rounded-md hover:bg-[#3c3b3b] transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          onClick={() => setFilter(STATUS.Active)}
        >
          {STATUS.Active}
        </Button>
      </div>
      <Separator className="my-4" />
      {!isLoading ? (
        <ul className="space-y-2">
          {filteredTodos.length ? (
            filteredTodos.map((todo) => (
              <Todo deleteTodo={deleteTodo} key={todo.id} todo={todo} updateTodo={updateTodo} />
            ))
          ) : (
            <p>No todos</p>
          )}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
      <Button className="mt-4" onClick={() => addTodo("New Todo")}>
        Add Todo
      </Button>
    </div>
  )
}

export default Todos
