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
