"use client"

import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

import { CustomButton } from "../Button/Button"

export const Header = () => {
  const { data: session, status } = useSession()

  const router = useRouter()
  const pathname = usePathname()

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
          {session && pathname !== "/todos" && status === "authenticated" ? (
            <CustomButton
              onClick={() => router.push("/todos")}
              style="w-auto"
              text="Return to todos"
            />
          ) : null}

          <CustomButton onClick={handleLogout} style="w-auto" text="Logout" />
        </>
      ) : null}
    </div>
  )
}
