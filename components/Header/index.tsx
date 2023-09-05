import { UserButton, auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import prismadb from "@/lib/prismadb"
import StoreSwitcher from "./components/StoreSwitcher"
import MainNav from "./components/MainNav"

export default async function Header() {
  const { userId } = auth()

  // If the user is not authenticated, redirect to the sign-in page
  if (!userId) redirect("/sign-in")

  // Fetch the list of stores associated with the user
  const stores = await prismadb.store.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher stores={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
