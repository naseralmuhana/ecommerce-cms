import { Check, PlusCircle, Store as StoreIcon } from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { FormattedStoresParams } from "."

type Props = {
  formattedStores: FormattedStoresParams[]
  currentStore: FormattedStoresParams | undefined
  onSelectStore: (store: FormattedStoresParams) => void
  onSelectCreateStore: () => void
}

export default function DropDown({
  formattedStores,
  currentStore,
  onSelectStore,
  onSelectCreateStore,
}: Props) {
  return (
    <Command>
      <CommandList>
        <CommandInput placeholder="Search Store..." />
        <CommandEmpty>No Store found.</CommandEmpty>
        <CommandGroup heading="Stores">
          {formattedStores.map((store) => (
            <CommandItem
              key={store.id}
              onSelect={() => onSelectStore(store)}
              className="text-sm hover:cursor-pointer"
            >
              <StoreIcon className="mr-2 h-4 w-4" />
              {store.label}
              <Check
                className={cn(
                  "ml-auto h-4 w-4",
                  currentStore?.id === store.id ? "opacity-100" : "opacity-0"
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <CommandSeparator />
      <CommandList>
        <CommandGroup>
          <CommandItem
            onSelect={() => onSelectCreateStore()}
            className="hover:cursor-pointer"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Create Store
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
