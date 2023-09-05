import Header from "@/components/Header"
import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

interface DashboardLayoutProps {
  children: React.ReactNode
  params: { storeId: string }
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  // Check if the user is authenticated
  const { userId } = auth()
  if (!userId) redirect("/sign-in")

  // Find the store based on storeId and userId
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId, userId },
  })

  // If store is not found, redirect to home
  if (!store) redirect("/")

  return (
    <>
      <Header />
      {children}
    </>
  )
}
