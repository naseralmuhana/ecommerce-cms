"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableRowActions } from "@/components/ui/data-table-row-actions"
import { Checkbox } from "@/components/ui/checkbox"

export const billboardsColumns: ColumnDef<BillboardColumnsType>[] = [
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
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Label" enableHide={false} />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      const { label, imageUrl } = row.original
      return (
        <Image
          width={90}
          height={90}
          priority={true}
          sizes="(min-width: 620px) 80px, (min-width: 460px) calc(25vw - 70px), 41px"
          src={imageUrl}
          alt={`${label} image`}
          className="rounded-md shadow-md"
        />
      )
    },
    enableGlobalFilter: false,
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
      <DataTableRowActions data={row.original} path="billboards" />
    ),
    enableGlobalFilter: false,
  },
]
