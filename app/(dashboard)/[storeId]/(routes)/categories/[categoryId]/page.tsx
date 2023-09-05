import prismadb from "@/lib/prismadb"
import CategoryForm from "./components/CategoryForm"

type CategoryPageProps = {
  params: { categoryId: string; storeId: string }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prismadb.category.findUnique({
    where: { id: params.categoryId, storeId: params.storeId },
  })

  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  )
}
