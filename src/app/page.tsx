"use client"

import "@radix-ui/themes/styles.css"

import Link from "next/link"

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <p>Have account?</p>
      <Link className="border mb-5" href="/auth/login">
        Login
      </Link>
      <p>Don't have account </p>
      <Link className="border" href="/auth/register">
        Register
      </Link>
    </main>
  )
}
