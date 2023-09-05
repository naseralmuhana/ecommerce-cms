import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { TablePageContent } from "@/components/TablePageContent"
import { categoriesColumns } from "@/components/columns/categories-columns"

interface CategoriesPageProps {
  params: { storeId: string }
}

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
    include: { billboard: true },
    orderBy: { updatedAt: "desc" },
  })

  const formattedCategories: CategoryColumnsType[] = categories.map(
    ({ id, name, updatedAt, billboard }) => ({
      id,
      name,
      billboardLabel: billboard.label,
      updatedAt: format(updatedAt, "kk:mm MMMM do, yyyy"),
    })
  )
  return (
    <TablePageContent
      data={formattedCategories}
      columns={categoriesColumns}
      headingTitle="Categories"
      headingDescription="Manage categories for your store"
      apiAlertListEntityName="categories"
      apiAlertListEntityIdName="categoryId"
    />
  )
}
export default CategoriesPage
