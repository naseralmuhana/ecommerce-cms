import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import type { Metadata } from "next"

import ModalProvider from "@/providers/ModalProvider"
import ToastProvider from "@/providers/ToastProvider"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

interface RootLayoutProps {
  children: React.ReactNode
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ModalProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
