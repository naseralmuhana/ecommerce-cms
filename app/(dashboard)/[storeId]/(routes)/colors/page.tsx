import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { TablePageContent } from "@/components/TablePageContent"
import { colorColumns } from "@/components/columns/colors-columns"

interface ColorsPageProps {
  params: { storeId: string }
}

const ColorsPage: React.FC<ColorsPageProps> = async ({ params }) => {
  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
    orderBy: { updatedAt: "desc" },
  })

  const formattedColors: ColorColumnsType[] = colors.map(
    ({ id, name, value, updatedAt }) => ({
      id,
      name,
      value,
      updatedAt: format(updatedAt, "kk:mm MMMM do, yyyy"),
    })
  )

  return (
    <TablePageContent
      data={formattedColors}
      columns={colorColumns}
      headingTitle="Colors"
      headingDescription="Manage colors for your store"
      apiAlertListEntityName="colors"
      apiAlertListEntityIdName="colorId"
    />
  )
}
export default ColorsPage
