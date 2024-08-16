"use client"

import { usePathname } from "next/navigation"

export const Footer = () => {
  const pathname = usePathname()

  return (
    <div className="h-60px mb-5 text-center">
      {pathname.includes("auth") ? null : (
        <p className="text-[12px] text-[#000000] animate-pulse">
          Double-click on a todo to edit it.
        </p>
      )}
      <p className="text-[12px] text-[#000000]">The test task was created by Kyrylo Pikhno.</p>
    </div>
  )
}
