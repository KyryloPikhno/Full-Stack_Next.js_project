"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@radix-ui/themes"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { ITodo } from "@/interfaces"
import { todoSchema } from "@/validation"

import { CustomButton } from "../Button/Button"
import { InputField } from "../InputField/InputField"
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

  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(todoSchema),
  })

  const {
    setError,
    clearErrors,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods

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

  const onSubmit = async (data: { newTodo: string }) => {
    try {
      await addTodo(data.newTodo)
    } catch (error) {
      console.log("error", error)
      setError("root", { message: "Something went wrong. Try again.", type: "manual" })
    }
  }

  const isLoading = status === "loading"

  return (
    <div className="p-4 min-h-[80vh] mb-20">
      <h1 className="text-[30px] font-bold mb-4 text-center">Your Todos</h1>

      <div className="flex justify-between mb-2 w-[500px]">
        <CustomButton
          onClick={() => setFilter(STATUS.ALL)}
          style="w-[140px]"
          text={STATUS.ALL}
          type="button"
        />
        <CustomButton
          onClick={() => setFilter(STATUS.Completed)}
          style="w-[140px]"
          text={STATUS.Completed}
          type="button"
        />
        <CustomButton
          onClick={() => setFilter(STATUS.Active)}
          style="w-[140px]"
          text={STATUS.Active}
          type="button"
        />
      </div>

      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-4"
          onChange={() => clearErrors()}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="my-2">
            <InputField name="newTodo" placeholder="" style="w-full" title="Create todo" />
          </div>

          {!isLoading ? (
            <div className="space-y-2">
              {filteredTodos.length ? (
                filteredTodos.map((todo) => (
                  <Todo deleteTodo={deleteTodo} key={todo.id} todo={todo} updateTodo={updateTodo} />
                ))
              ) : (
                <p>No todos</p>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </form>
      </FormProvider>
      <Button className="mt-4" onClick={() => addTodo("New Todo")}>
        Add Todo
      </Button>
    </div>
  )
}

export default Todos
