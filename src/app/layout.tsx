import "./globals.css"

import { Theme } from "@radix-ui/themes"
import type { Metadata } from "next"
import { Roboto_Mono } from "next/font/google"
import Head from "next/head"
import { Toaster } from "react-hot-toast"

import { Footer } from "@/components/Footer/Footer"
import { Header } from "@/components/Header/Header"

import SessionWrapper from "../wrappers/SessionWrapper"

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
    <SessionWrapper>
      <html lang="en">
        <Head>
          <link href="/favicon.ico" rel="icon" />
        </Head>
        <body>
          <Theme className="flex flex-col items-center justify-between sm:min-h-screen min-h-[88vh] bg-[#FFFFFF]">
            <Header />
            <main className={robotoMono.className}>{children}</main>
            <Footer />
            <Toaster />
          </Theme>
        </body>
      </html>
    </SessionWrapper>
  )
}
