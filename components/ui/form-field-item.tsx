import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

interface FormFieldItemProps {
  label: String
  children: React.ReactNode
}

export const FormFieldItem: React.FC<FormFieldItemProps> = ({
  label,
  children,
}) => {
  return (
    <FormItem>
      <FormLabel className="capitalize">{label}</FormLabel>
      <FormControl>{children}</FormControl>
      <FormMessage />
    </FormItem>
  )
}
