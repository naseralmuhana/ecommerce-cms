import { Loader as LoaderIcon } from "lucide-react"
import { MouseEventHandler } from "react"

import { Button } from "@/components/ui/button"
import useLoading from "@/hooks/useLoading"

interface LoaderButtonProps {
  type?: "submit" | "button"
  text: string
  variant?: "destructive" | "outline" | "default"
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined
}

export function LoaderButton({
  type = "submit",
  text,
  variant = "default",
  onClick,
}: LoaderButtonProps) {
  const loading = useLoading((state) => state.loading)
  return (
    <Button type={type} disabled={loading} variant={variant} onClick={onClick}>
      {loading ? <LoaderIcon className="h-4 w-4 animate-spin" /> : text}
    </Button>
  )
}
