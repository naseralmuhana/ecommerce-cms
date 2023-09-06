import prismadb from "@/lib/prismadb"
import SizeForm from "./components/SizeForm"

interface SizePageProps {
  params: { storeId: string; sizeId: string }
}

export default async function SizePage({ params }: SizePageProps) {
  const size = await prismadb.size.findUnique({
    where: { id: params.sizeId, storeId: params.storeId },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  )
}
