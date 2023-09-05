import prismadb from "@/lib/prismadb"

interface DashboardPageProps {
  params: { storeId: string }
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId },
  })
  return <div>DashboardPage {store?.name}</div>
}

export async function generateStaticParams({ params }: DashboardPageProps) {
  const stores = await prismadb.store.findMany({
    where: { id: params.storeId },
  })
  return stores.map((store) => ({
    storeId: store.id,
  }))
}
