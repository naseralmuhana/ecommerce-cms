import { Control } from "react-hook-form"

import { FormField } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useLoading from "@/hooks/useLoading"
import { FormFieldItem } from "@/components/ui/form-field-item"

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
        <FormFieldItem label={name}>
          <Input
            type={type}
            placeholder={placeholder}
            {...field}
            disabled={loading}
          />
        </FormFieldItem>
      )}
    />
  )
}
