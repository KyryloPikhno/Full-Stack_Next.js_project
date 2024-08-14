"use client"

import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

import { CustomButton } from "../Button/Button"

export const Header = () => {
  const { data: session } = useSession()

  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const fullName = `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""}`

  return (
    <div className="w-full flex justify-end h-20 pr-10 items-center gap-[20px]">
      {session ? (
        <>
          <p>{fullName}</p>
          <CustomButton onClick={handleLogout} style="w-auto" text="Logout" />
        </>
      ) : null}
    </div>
  )
}
