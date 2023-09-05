"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ModalProps {
  title: string
  description: string
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode // Allow passing child components
}

export const Modal: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
}) => {
  // Handle changes in the dialog's open state
  const handleOpenChange = (open: boolean) => {
    if (!open) onClose() // Call the onClose function when dialog is closed
  }

  return (
    // Use the Dialog component to create the modal
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        {/* DialogHeader contains the title and description */}
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* Render any child components passed to the modal */}
        {children}
      </DialogContent>
    </Dialog>
  )
}
