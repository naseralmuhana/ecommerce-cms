"use client"

import { useEffect, useState } from "react"

import useLoading from "@/hooks/useLoading"
import useOpen from "@/hooks/useOpen"
import { Modal } from "@/components/ui/modal"
import { LoaderButton } from "@/components/ui/button-loader"
import { Button } from "@/components/ui/button"

type AlertModalProps = {
  onClose: () => void
  isOpen?: boolean
  onConfirm: () => void
  title?: string
  description?: string
}

export const AlertModal: React.FC<AlertModalProps> = ({
  onClose,
  onConfirm,
  isOpen,
  title = "Are you sure?",
  description = "This item will be deleted immediately. You cannot undo this action.",
}) => {
  const loading = useLoading((state) => state.loading)
  const open = useOpen((state) => state.open)

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen || open}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button
          variant="outline"
          type="button"
          disabled={loading}
          onClick={onClose}
        >
          Cancel
        </Button>
        <LoaderButton
          text="Confirm"
          onClick={onConfirm}
          variant="destructive"
        />
      </div>
    </Modal>
  )
}
