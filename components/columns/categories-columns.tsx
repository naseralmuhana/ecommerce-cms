"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "@/components/ui/data-table-row-actions"

export const categoriesColumns: ColumnDef<CategoryColumnsType>[] = [
  {
    accessorKey: "id",
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
        onChange={row.getToggleSelectedHandler()}
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" enableHide={false} />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "billboardLabel",
    id: "billboard",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Billboard" />
    ),
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "updatedAt",
    id: "Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions data={row.original} path="categories" />
    ),
  },
]
