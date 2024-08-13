"use client"

import { useRouter } from "next/navigation"
import { signOut } from "next-auth/react"

const LogoutButton = () => {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  )
}

export default LogoutButton
