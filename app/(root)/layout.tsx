import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import prismadb from "@/lib/prismadb"

interface SetupLayoutProps {
  children: React.ReactNode
}

export default async function SetupLayout({ children }: SetupLayoutProps) {
  const { userId } = auth()
  if (!userId) redirect("/sign-in")

  // Check if there are any stores related to the logged-in user
  // Retrieve the first store associated with the user
  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  })

  // If a store is found, redirect to the store page using the store id
  if (store) redirect(`/${store.id}/`)

  // If no store is found, render the setup page under(root) (to create a new store)
  return <>{children}</>
}
