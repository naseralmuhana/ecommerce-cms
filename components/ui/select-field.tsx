"use client"

import { Control } from "react-hook-form"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import useLoading from "@/hooks/useLoading"

interface SelectFieldProps {
  control: Control<FormValuesType>
  name: string
  label: string
  placeholder: string
  data: { id: string; label?: string; name?: string }[]
}

const SelectField: React.FC<SelectFieldProps> = ({
  control,
  name,
  label,
  placeholder,
  data,
}) => {
  const loading = useLoading((state) => state.loading)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            disabled={loading}
            onValueChange={field.onChange}
            defaultValue={field.value || undefined}
            value={field.value || undefined}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  defaultValue={field.value || undefined}
                  placeholder={placeholder}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {data.map((data) => (
                <SelectItem key={data.id} value={data.id}>
                  {data.label || data.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
export default SelectField
