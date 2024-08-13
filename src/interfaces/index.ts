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

export interface ITodoProps {
  todo: ITodo
  deleteTodo: (value: string) => void
  updateTodo: (value: string, updatedTodo: { completed: boolean }) => void
}
