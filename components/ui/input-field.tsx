import { Control } from "react-hook-form"

import {
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useLoading from "@/hooks/useLoading"

interface InputFieldProps {
  control: Control<FormValuesType>
  name: "name" | "price" | "value" | "label"
  placeholder: string
}

export const InputField: React.FC<InputFieldProps> = ({
  control,
  placeholder,
  name,
}) => {
  const loading = useLoading((state) => state.loading)
  const type = name === "price" ? "number" : "text"
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="capitalize">{name}</FormLabel>
          <FormControl>
            <Input
              type={type}
              disabled={loading}
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
