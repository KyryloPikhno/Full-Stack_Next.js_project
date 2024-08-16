"use client"

import { usePathname, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"

import { toast } from "@/utils/toast"

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
      toast()
      toast((error as Error).message)
    }
  }

  const fullName = `${session?.user?.firstName[0]}. ${session?.user?.lastName}`

  return (
    <div className="w-full flex justify-end h-20 sm:pr-10 pr-6 items-center sm:gap-4 gap-2">
      {session ? (
        <>
          <p className="sm:text-[14px] text-[10px] font-medium">{fullName}</p>
          {session && pathname !== "/todos" && status === "authenticated" ? (
            <CustomButton onClick={() => router.push("/todos")} style="w-auto" text="Todos" />
          ) : null}

          <CustomButton onClick={handleLogout} style="w-auto" text="Logout" />
        </>
      ) : null}
    </div>
  )
}
