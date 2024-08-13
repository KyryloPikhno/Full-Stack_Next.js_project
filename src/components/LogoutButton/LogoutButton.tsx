"use client"

import { Button } from "@radix-ui/themes"
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
    <Button
      className="bg-[#000000] text-white px-4 py-2 rounded-md hover:bg-[#3c3b3b] transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
      onClick={handleLogout}
    >
      Logout
    </Button>
  )
}

export default LogoutButton
