"use client"

import { ColumnDef } from "@tanstack/react-table"
import Image from "next/image"
import { Check, X } from "lucide-react"
import { Category, Color, Size, Image as ImagePrisma } from "@prisma/client"

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { DataTableRowActions } from "@/components/ui/data-table-row-actions"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip } from "@/components/ui/tooltip-custom"

export type ProductColumnsType = {
  id: string
  name: string
  images: ImagePrisma[]
  price: string
  categories: Category[]
  sizes: Size[]
  colors: Color[]
  isFeatured: boolean
  isArchived: boolean
  updatedAt: string
}

export const productColumns: ColumnDef<ProductColumnsType>[] = [
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
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" enableHide={false} />
    ),
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "images",
    header: "Images",
    enableGlobalFilter: false,
    cell: ({ row }) => {
      const { images, name } = row.original
      const imagesLength = images.length
      const content = (
        <div className="flex flex-wrap items-center gap-2">
          <Image
            width={90}
            height={90}
            priority={true}
            sizes="(min-width: 620px) 80px, (min-width: 460px) calc(25vw - 70px), 41px"
            src={images[0].url}
            alt={`${name} image`}
            className="rounded-md shadow-md w-auto"
          />
          {imagesLength > 1 ? (
            <Tooltip text={`${images.length - 1} more image(s)`}>
              <span>+{images.length - 1}</span>
            </Tooltip>
          ) : null}
        </div>
      )

      return content
    },
  },

  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
  },
  {
    accessorKey: "category",
    header: "Categories",
    id: "categories",
    cell: ({ row }) => {
      const { categories } = row.original
      const content = categories.map(({ id, name }) => (
        <Badge variant="outline" key={id}>
          {name}
        </Badge>
      ))
      return <div className="flex gap-1 flex-wrap">{content}</div>
    },
  },
  {
    accessorKey: "size",
    header: "Sizes",
    id: "Sizes",
    cell: ({ row }) => {
      const { sizes } = row.original
      const content = sizes.map(({ id, name, value }) => (
        <Tooltip text={name} key={id}>
          <Badge variant="outline" key={id}>
            {value}
          </Badge>
        </Tooltip>
      ))
      return <div className="flex gap-1 flex-wrap">{content}</div>
    },
  },
  {
    accessorKey: "color",
    header: "Colors",
    id: "Colors",
    cell: ({ row }) => {
      const { colors } = row.original
      const content = colors.map(({ id, value }) => (
        <Tooltip text={value} key={id}>
          <div
            key={id}
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: value }}
          />
        </Tooltip>
      ))

      return <div className="flex items-center gap-1 flex-wrap">{content}</div>
    },
  },
  {
    accessorKey: "isArchived",
    id: "is Archived",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Archived" />
    ),
    cell: ({ row }) => {
      const { isArchived } = row.original
      return isArchived ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )
    },
  },
  {
    accessorKey: "isFeatured",
    id: "is Featured",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Featured" />
    ),
    cell: ({ row }) => {
      const { isFeatured } = row.original
      return isFeatured ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <X className="w-4 h-4 text-red-500" />
      )
    },
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
      <DataTableRowActions data={row.original} path="products" />
    ),
  },
]
