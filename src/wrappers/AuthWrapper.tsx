"use client"

import { useSession } from "next-auth/react"
import { ReactNode, useEffect } from "react"

interface AuthProviderProps {
  children: ReactNode
}

const AuthWrapper = ({ children }: AuthProviderProps) => {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (!session?.user && status !== "loading") {
      window.location.href = "/auth/login"
    }
  }, [session, status])

  return <>{children}</>
}

export default AuthWrapper
