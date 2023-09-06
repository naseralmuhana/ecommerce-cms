import { Control } from "react-hook-form"

import { FormField } from "@/components/ui/form"
import { FormFieldItem } from "@/components/ui/form-field-item"
import { Input } from "@/components/ui/input"
import useLoading from "@/hooks/useLoading"

interface ValueFieldProps {
  control: Control<FormValuesType>
}
const ValueField: React.FC<ValueFieldProps> = ({ control }) => {
  const loading = useLoading((state) => state.loading)
  return (
    <FormField
      control={control}
      name="value"
      render={({ field }) => (
        <FormFieldItem label="Value">
          <div className="flex items-center gap-x-4">
            <Input disabled={loading} placeholder="Color value" {...field} />
            <div
              className="border p-4 rounded-full"
              style={{ backgroundColor: field.value }}
            />
          </div>
        </FormFieldItem>
      )}
    />
  )
}
export default ValueField
