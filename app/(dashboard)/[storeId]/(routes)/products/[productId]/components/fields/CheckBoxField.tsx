import { Control } from "react-hook-form"

import { Checkbox } from "@/components/ui/checkbox"
import useLoading from "@/hooks/useLoading"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

interface CheckBoxFieldProps {
  control: Control<FormValuesType>
  name: "isFeatured" | "isArchived"
}

export const CheckBoxField: React.FC<CheckBoxFieldProps> = ({
  control,
  name,
}) => {
  const loading = useLoading((state) => state.loading)

  const label = name === "isArchived" ? "Archived" : "Featured"
  const description =
    name === "isArchived"
      ? "This product will not appear anywhere in the store."
      : "This product will appear on the home page."
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              disabled={loading}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
        </FormItem>
      )}
    />
  )
}
