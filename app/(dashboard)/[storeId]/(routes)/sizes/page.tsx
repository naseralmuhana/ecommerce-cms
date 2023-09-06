import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { TablePageContent } from "@/components/TablePageContent"
import { sizeColumns } from "@/components/columns/sizes-columns"

interface SizesPageProps {
  params: { storeId: string }
}

const SizesPage: React.FC<SizesPageProps> = async ({ params }) => {
  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
    orderBy: { updatedAt: "desc" },
  })

  const formattedSizes: SizeColumnsType[] = sizes.map(
    ({ id, name, value, updatedAt }) => ({
      id,
      name,
      value,
      updatedAt: format(updatedAt, "kk:mm MMMM do, yyyy"),
    })
  )

  return (
    <TablePageContent
      data={formattedSizes}
      columns={sizeColumns}
      headingTitle="Sizes"
      headingDescription="Manage sizes for your store"
      apiAlertListEntityName="sizes"
      apiAlertListEntityIdName="sizeId"
    />
  )
}
export default SizesPage
