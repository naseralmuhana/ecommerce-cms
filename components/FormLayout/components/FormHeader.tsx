import { Trash } from "lucide-react"

import useOpen from "@/hooks/useOpen"
import useLoading from "@/hooks/useLoading"
import { AlertModal } from "@/components/ui/alert-modal"
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface FormHeaderProps {
  handleDelete: () => Promise<void>
  title: string
  description: string
  isInitialData: boolean
}

export const FormHeader: React.FC<FormHeaderProps> = ({
  handleDelete,
  title,
  description,
  isInitialData,
}) => {
  const loading = useLoading((state) => state.loading)
  const setOpen = useOpen((state) => state.setOpen)

  return (
    <>
      <AlertModal onClose={() => setOpen(false)} onConfirm={handleDelete} />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {isInitialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
    </>
  )
}
