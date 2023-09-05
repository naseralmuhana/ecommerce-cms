import { redirect } from "next/navigation"

import SettingsForm from "./components/SettingsForm"
import prismadb from "@/lib/prismadb"

interface SettingsPageProps {
  params: { storeId: string }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId },
  })

  if (!store) redirect("/")

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}
