"use client"

import { useSession } from "next-auth/react"
import { ReactNode, useEffect } from "react"

interface AuthProviderProps {
  children: ReactNode
}

const AuthWrapper = ({ children }: AuthProviderProps) => {
  const { data: session } = useSession()

  console.log("status", session)

  useEffect(() => {
    if (!session?.user) {
      window.location.href = "/auth/login"
    }
  }, [session])

  return <>{children}</>
}

export default AuthWrapper
