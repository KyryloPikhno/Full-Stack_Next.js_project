import "./globals.css"

import type { Metadata } from "next"
import { Roboto_Mono } from "next/font/google"

import { Footer } from "@/components/Footer/Footer"
import { Header } from "@/components/Header/Header"

const robotoMono = Roboto_Mono({ subsets: ["latin"], weight: ["400", "700"] })

export const metadata: Metadata = {
  description: "",
  title: "Awesome todos",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-between min-h-screen">
        <Header />
        <main className={robotoMono.className}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
