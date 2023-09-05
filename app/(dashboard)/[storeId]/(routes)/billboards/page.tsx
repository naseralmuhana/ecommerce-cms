import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { TablePageContent } from "@/components/TablePageContent"
import { billboardsColumns } from "@/components/columns/billboards-columns"

interface BillboardsPageProps {
  params: { storeId: string }
}

const BillboardsPage = async ({ params }: BillboardsPageProps) => {
  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
    orderBy: { updatedAt: "desc" },
  })

  const formattedBillboards: BillboardColumnsType[] = billboards.map(
    ({ id, label, imageUrl, updatedAt }) => ({
      id,
      label,
      imageUrl,
      updatedAt: format(updatedAt, "kk:mm MMMM do, yyyy"),
    })
  )

  return (
    <TablePageContent
      data={formattedBillboards}
      columns={billboardsColumns}
      headingTitle="Billboards"
      headingDescription="Manage billboards for your store"
      apiAlertListEntityName="billboards"
      apiAlertListEntityIdName="billboardId"
    />
  )
}
export default BillboardsPage
