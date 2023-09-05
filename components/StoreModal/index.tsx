"use client"

import { Modal } from "@/components/ui/modal"
import useStoreModal from "@/hooks/useStoreModal"
import StoreModalForm from "./components/StoreModalForm"

// StoreModal component displays a modal for creating a new store
const StoreModal = () => {
  // Fetch onClose and isOpen from the useStoreModal hook's state
  const onClose = useStoreModal((state) => state.onClose)
  const isOpen = useStoreModal((state) => state.isOpen)

  return (
    <Modal
      title="Create store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <StoreModalForm />
    </Modal>
  )
}
export default StoreModal
