import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string
    firstName: string
    lastName: string
  }
}

export interface ILogin {
  email: string
  password: string
}

export interface IRegister {
  firstName: string
  lastName: string
  password: string
  email: string
}

export interface ITodo {
  id: string
  body: string
  userId: string
  createdAt: Date
  updatedAt: Date
  completed: boolean
}

export interface IUpdatedTodo {
  body?: string
  completed?: boolean
}

export interface ITodoProps {
  todo: ITodo
  deleteTodo: (value: string) => void
  updateTodo: (value: string, updatedTodo: IUpdatedTodo) => void
}

export interface IButtonProps {
  text: string
  style?: string
  error?: string
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "reset" | "submit"
}

export interface IInputProps {
  name: string
  type?: string
  style?: string
  title?: string
  placeholder: string
}
