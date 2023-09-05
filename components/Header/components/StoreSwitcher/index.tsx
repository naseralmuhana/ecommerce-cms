"use client"

import { useState } from "react"
import { Store } from "@prisma/client"
import { ChevronsUpDown, Store as StoreIcon } from "lucide-react"
import { useParams, usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import useStoreModal from "@/hooks/useStoreModal"
import { cn } from "@/lib/utils"
import DropDown from "./DropDown"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export type FormattedStoresParams = { label: string; id: string }

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>
interface StoreSwitcherProps extends PopoverTriggerProps {
  stores: Store[]
}

export default function StoreSwitcher({ stores = [] }: StoreSwitcherProps) {
  const params = useParams()
  const path = usePathname()
  const storeModal = useStoreModal()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  // Format the store stores for the dropdown
  const formattedStores: FormattedStoresParams[] = stores.map((item) => ({
    label: item.name,
    id: item.id,
  }))

  // Find the current store based on the URL parameter(id)
  const currentStore = formattedStores.find(
    (item) => item.id === params.storeId
  )

  // Handle selecting a store from the dropdown
  const handleSelectStore = (store: FormattedStoresParams) => {
    setOpen(false)
    const currentId = params.storeId as string // Get the current store ID from params
    const redirectedPath = path.replace(currentId, store.id) // Replace the ID in the path with the selected store's ID
    router.push(redirectedPath) // Navigate to the selected store's page
  }

  // Handle creating a new store
  const handleCreateNewStore = () => {
    setOpen(false)
    storeModal.onOpen()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className={cn("w-[200px] justify-between")}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <DropDown
          formattedStores={formattedStores}
          currentStore={currentStore}
          onSelectStore={handleSelectStore}
          onSelectCreateStore={handleCreateNewStore}
        />
      </PopoverContent>
    </Popover>
  )
}
