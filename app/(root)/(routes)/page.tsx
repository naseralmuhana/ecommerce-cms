"use client"

import { useEffect } from "react"

import useStoreModal from "@/hooks/useStoreModal"

// Component responsible for triggering the store creation modal
export default function SetupPage() {
  // Get the onOpen and isOpen functions from the useStoreModal hook
  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)

  // UseEffect to open the modal when it's not already open
  useEffect(() => {
    // Only open the modal if it's currently closed
    if (!isOpen) onOpen()
  }, [isOpen, onOpen])

  // Render nothing, as this component only handles modal opening
  return null
}
