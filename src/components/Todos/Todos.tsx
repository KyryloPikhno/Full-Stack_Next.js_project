import { yupResolver } from "@hookform/resolvers/yup"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

import { ITodo } from "@/interfaces"
import { todoSchema } from "@/validation"

import { CustomButton } from "../Button/Button"
import { InputField } from "../InputField/InputField"
import Todo from "../Todo/Todo"

enum FILTER {
  All = "All",
  Active = "Active",
  Completed = "Completed",
}

const Todos = () => {
  const { data: session, status } = useSession()
  const [filter, setFilter] = useState<FILTER>(FILTER.All)
  const [todos, setTodos] = useState<ITodo[] | []>([])

  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(todoSchema),
  })

  const { handleSubmit, clearErrors, setError } = methods

  useEffect(() => {
    if (session) {
      fetchTodos(filter)
    }
  }, [session, filter])

  const fetchTodos = async (filter: FILTER) => {
    try {
      const res = await fetch(`/api/todos?filter=${filter}`)
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

  const toggleAllTodos = async () => {
    try {
      const response = await fetch("/api/todos", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
      })

      if (!response.ok) {
        throw new Error("Failed to toggle todos")
      }

      const updatedTodos = await response.json()
      setTodos(updatedTodos)
    } catch (error) {
      console.error("Error toggling todos:", error)
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

  const clearCompletedTodos = async () => {
    try {
      const res = await fetch("/api/todos?completed=true", {
        method: "DELETE",
      })

      if (res.ok) {
        const updatedTodos = await res.json()
        setTodos(updatedTodos)
      } else {
        const error = await res.json()
        console.error("Failed to clear completed todos:", error)
      }
    } catch (error) {
      console.error("Error clearing completed todos:", error)
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
  const isAllCompleted = todos.every((todo) => todo.completed)
  const leftCount = todos.filter((todo) => !todo.completed).length

  return (
    <div className="p-4 min-h-[80vh] mb-20">
      <h1 className="text-[30px] font-bold mb-4 text-center">Your Todos</h1>

      <div className="flex justify-between mb-2 sm:w-[500px]">
        <CustomButton
          onClick={() => setFilter(FILTER.All)}
          style={` ${filter === FILTER.All ? "" : "bg-[#FFFFFF] hover:bg-[#FFFFFF] text-[#000000]"}`}
          text={FILTER.All}
          type="button"
        />
        <CustomButton
          onClick={() => setFilter(FILTER.Completed)}
          style={` ${filter === FILTER.Completed ? "" : "bg-[#FFFFFF] hover:bg-[#FFFFFF] text-[#000000]"}`}
          text={FILTER.Completed}
          type="button"
        />
        <CustomButton
          onClick={() => setFilter(FILTER.Active)}
          style={` ${filter === FILTER.Active ? "" : "bg-[#FFFFFF] hover:bg-[#FFFFFF] text-[#000000]"}`}
          text={FILTER.Active}
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
            <InputField
              name="newTodo"
              placeholder="Create something..."
              style="sm:w-[500px] w-[320px] h-[60px]"
              title="Create todo"
            />
          </div>

          <div className="flex justify-between mb-2 sm:w-[500px]">
            <CustomButton
              onClick={toggleAllTodos}
              text={isAllCompleted ? "Uncomplete All" : "Complete All"}
              type="button"
            />
            <div className="sm:w-[140px] w-[100px] text-[10px] rounded-[8px] text-[14px] flex justify-center items-center border-[#000000] border-[2px] ">
              {`Left: ${leftCount} ${leftCount > 1 ? "items" : "item"}`}
            </div>

            <CustomButton onClick={clearCompletedTodos} text="Clear completed" type="button" />
          </div>

          {!isLoading ? (
            <div className="space-y-2">
              {todos.length
                ? todos.map((todo) => (
                    <Todo
                      deleteTodo={deleteTodo}
                      key={todo.id}
                      todo={todo}
                      updateTodo={updateTodo}
                    />
                  ))
                : null}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

export default Todos
