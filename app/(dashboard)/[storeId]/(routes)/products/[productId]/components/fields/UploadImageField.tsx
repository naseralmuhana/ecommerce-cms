import { Control } from "react-hook-form"

import { FormField } from "@/components/ui/form"
import { FormFieldItem } from "@/components/ui/form-field-item"
import { ImageUpload } from "@/components/ui/image-upload"

interface UploadImageFieldProps {
  control: Control<FormValuesType>
}

export const UploadImageField: React.FC<UploadImageFieldProps> = ({
  control,
}) => {
  return (
    <FormField
      control={control}
      name="images"
      render={({ field }) => (
        <FormFieldItem label="Images">
          <ImageUpload
            value={field.value.map((image: { url: string }) => image.url)}
            onChange={(url) => field.onChange([...field.value, { url }])}
            onRemove={(url) =>
              field.onChange([
                ...field.value.filter(
                  (current: { url: string }) => current.url !== url
                ),
              ])
            }
          />
        </FormFieldItem>
      )}
    />
  )
}
