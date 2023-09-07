"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ColumnDef } from "@tanstack/react-table"

import type { ProductColumnsType } from "@/components/columns/products-columns"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { ApiAlertList } from "@/components/ui/api-alert-list"
import { DataTable } from "@/components/ui/data-table"

/**
 * A reusable component for rendering the main content of a page.
 *
 * This component displays a page heading, a button to add new content,
 * a data table, and an API alert list. It's designed to be used within
 * page layouts.
 *
 */

interface TablePageContentProps {
  data: TableColumnsType[] | ProductColumnsType[]
  columns: ColumnDef<any>[]
  headingTitle: string
  headingDescription: string
  apiAlertListEntityName: ApiAlertListEntityName
  apiAlertListEntityIdName: ApiAlertListEntityNameId
}

export const TablePageContent: React.FC<TablePageContentProps> = ({
  data,
  columns,
  headingTitle,
  headingDescription,
  apiAlertListEntityName,
  apiAlertListEntityIdName,
}) => {
  const router = useRouter()
  const params = useParams()

  const title = `${headingTitle} (${data.length})`
  const addNewPath = `/${params.storeId}/${apiAlertListEntityName}/new`

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading title={title} description={headingDescription} />
          <Button onClick={() => router.push(addNewPath)}>
            <Plus className="mr-2 h-4 w-4" />
            Add new
          </Button>
        </div>
        <Separator />
        <DataTable
          columns={columns}
          data={data}
          apiPathToDeleteMany={apiAlertListEntityName}
        />
        <ApiAlertList
          entityName={apiAlertListEntityName}
          entityIdName={apiAlertListEntityIdName}
        />
      </div>
    </div>
  )
}
