"use client"

import { useSession } from "next-auth/react"

import AuthWrapper from "../wrappers/AuthWrapper"

const Todos = () => {
  const { data: session } = useSession()

  return (
    <AuthWrapper>
      <div>
        <h1>Welcome, todos</h1>
        <p>Email: {session?.user?.email}</p>
        <p>Id: {session?.user?.id}</p>
      </div>
    </AuthWrapper>
  )
}

export default Todos
