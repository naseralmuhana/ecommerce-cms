"use client"

import { useState } from "react"
import { Cross2Icon } from "@radix-ui/react-icons"
import { Table } from "@tanstack/react-table"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "react-hot-toast"

import useLoading from "@/hooks/useLoading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"
import { AlertModal } from "@/components/ui/alert-modal"
import { cellActionDeleteErrorMessage } from "@/lib/helpers"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  apiPathToDeleteMany: PathType
}

export function DataTableToolbar<TData>({
  table,
  apiPathToDeleteMany,
}: DataTableToolbarProps<TData>) {
  const params = useParams()
  const router = useRouter()

  const [open, setOpen] = useState(false)
  const { loading, setLoading } = useLoading()

  const isFiltered = table.getState().globalFilter
  const selectedRowIds = table
    .getSelectedRowModel()
    .rows.map((row) => row.original)
    .map((r: any) => r.id)

  const handleDeleteMany = async () => {
    try {
      setLoading(true)
      const { storeId } = params
      await axios.delete(`/api/${storeId}/${apiPathToDeleteMany}`, {
        data: { ids: selectedRowIds },
      })
      table.resetRowSelection()
      toast.success("selected deleted.")
      router.refresh()
    } catch (error) {
      toast.error(cellActionDeleteErrorMessage(apiPathToDeleteMany))
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        onConfirm={handleDeleteMany}
        onClose={() => setOpen(false)}
        isOpen={open}
      />
      <div className="flex items-center justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter any column..."
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value)
            }}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetGlobalFilter()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <Button
          size="icon"
          variant="destructive"
          className="h-8 w-8 mr-2"
          onClick={() => setOpen(true)}
          disabled={selectedRowIds.length < 1 || loading}
        >
          <Trash className="w-4 h-4" />
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </>
  )
}
