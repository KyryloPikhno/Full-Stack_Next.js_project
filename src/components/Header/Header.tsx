"use client"

import { useSession } from "next-auth/react"

import LogoutButton from "../LogoutButton/LogoutButton"

export const Header = () => {
  const { data: session } = useSession()

  const fullName = `${session?.user?.firstName ?? ""} ${session?.user?.lastName ?? ""}`

  return (
    <div className="w-full flex justify-end h-20 pr-10 items-center gap-[20px]">
      {session ? (
        <>
          <p>{fullName}</p>
          <LogoutButton />
        </>
      ) : null}
    </div>
  )
}
