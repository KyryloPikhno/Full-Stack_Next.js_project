"use client"

import Todos from "@/components/Todos/Todos"
import AuthWrapper from "@/wrappers/AuthWrapper"

const TodosPage = () => {
  return (
    <AuthWrapper>
      <Todos />
    </AuthWrapper>
  )
}

export default TodosPage
