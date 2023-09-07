"use client"

import { useState, useRef, useCallback, FC } from "react"
import { X } from "lucide-react"
import { Size, Color, Category } from "@prisma/client"
import { Command as CommandPrimitive } from "cmdk"
import { ControllerRenderProps } from "react-hook-form"

import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import useLoading from "@/hooks/useLoading"

type DataType = { id: string; name: string }
interface MultiSelectProps {
  data: DataType[]
  placeholder: string
  field:
    | ControllerRenderProps<FormValuesType, "sizes">
    | ControllerRenderProps<FormValuesType, "colors">
    | ControllerRenderProps<FormValuesType, "categories">
}

export const MultiSelect: FC<MultiSelectProps> = ({
  data,
  placeholder,
  field,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<DataType[]>(
    data.filter((d) => field.value.some((v: { id: string }) => v.id === d.id))
  )
  const [inputValue, setInputValue] = useState("")

  const loading = useLoading((state) => state.loading)

  const handleUnselect = useCallback(
    (data: DataType) => {
      field.onChange(field.value.filter((v: any) => v.id !== data.id))
      setSelected((prev) => prev.filter((s) => s.id !== data.id))
    },
    [field]
  )
  // console.log(placeholder, { field: field.value, selected })

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            setSelected((prev) => {
              const newSelected = [...prev]
              newSelected.pop()
              return newSelected
            })
            const newFields = [...field.value]
            newFields.pop()
            field.onChange([...newFields])
          }
        }
        // This is not a default behavior of the <input /> field
        if (e.key === "Escape") {
          input.blur()
        }
      }
    },
    [field]
  )

  const selectTables = data.filter(
    ({ id }) => !selected.some((s) => s.id === id)
  )
  return (
    <Command
      onKeyDown={handleKeyDown}
      className="block h-auto overflow-visible bg-transparent "
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex gap-1 flex-wrap">
          {selected.map((s) => {
            return (
              <Badge key={s.id} variant="secondary">
                {s.name}
                <button
                  disabled={loading}
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUnselect(s)
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={() => handleUnselect(s)}
                >
                  <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                </button>
              </Badge>
            )
          })}
          {/* Avoid having the "Search" Icon */}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            disabled={loading}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={`Select ${placeholder}...`}
            className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectTables.length > 0 ? (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandGroup className="h-full overflow-auto">
              {selectTables.map((d) => {
                return (
                  <CommandItem
                    key={d.id}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                    }}
                    onSelect={(value) => {
                      setInputValue("")
                      setSelected((prev) => [...prev, d])
                      field.onChange([...field.value, d])
                    }}
                    className={"cursor-pointer"}
                    disabled={loading}
                  >
                    {d.name}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </div>
        ) : null}
      </div>
    </Command>
  )
}
