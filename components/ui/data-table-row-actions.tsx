"use client"

import axios from "axios"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Copy, Edit, Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import type { ProductColumnsType } from "@/components/columns/products-columns"

import { Button } from "@/components/ui/button"
import useLoading from "@/hooks/useLoading"
import { AlertModal } from "@/components/ui/alert-modal"
import {
  cellActionDeleteErrorMessage,
  cellActionDeleteSuccessMessage,
} from "@/lib/helpers"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableRowActionsProps {
  data: TableColumnsType | ProductColumnsType
  path: PathType
}

export function DataTableRowActions({ data, path }: DataTableRowActionsProps) {
  const params = useParams()
  const router = useRouter()

  const setLoading = useLoading((state) => state.setLoading)
  const [Open, setOpen] = useState(false)

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success(`Id copied.`)
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/${params.storeId}/${path}/${data.id}`)
      router.refresh()
      toast.success(cellActionDeleteSuccessMessage(path))
    } catch (error) {
      toast.error(cellActionDeleteErrorMessage(path))
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }
  return (
    <>
      <AlertModal
        isOpen={Open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleCopy(data.id)}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${params.storeId}/${path}/${data.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="w-4 h-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
