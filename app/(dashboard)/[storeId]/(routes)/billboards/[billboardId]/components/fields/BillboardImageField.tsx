import { Control } from "react-hook-form"

import { FormField } from "@/components/ui/form"
import { FormFieldItem } from "@/components/ui/form-field-item"
import { ImageUpload } from "@/components/ui/image-upload"

interface BillboardImageFieldProps {
  control: Control<FormValuesType>
}

const BillboardImageField: React.FC<BillboardImageFieldProps> = ({
  control,
}) => {
  return (
    <FormField
      control={control}
      name="imageUrl"
      render={({ field }) => (
        <FormFieldItem label="Background Image">
          <ImageUpload
            value={field.value ? [field.value] : []}
            onChange={(url) => field.onChange(url)}
            onRemove={() => field.onChange("")}
          />
        </FormFieldItem>
      )}
    />
  )
}
export default BillboardImageField
