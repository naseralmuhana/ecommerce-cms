import prismadb from "@/lib/prismadb"
import ColorForm from "./components/ColorForm"

interface ColorPageProps {
  params: { storeId: string; colorId: string }
}

export default async function ColorPage({ params }: ColorPageProps) {
  const color = await prismadb.color.findUnique({
    where: { id: params.colorId, storeId: params.storeId },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  )
}
