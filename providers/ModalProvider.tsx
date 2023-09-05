"use client"

import { useEffect, useState } from "react"

import StoreModal from "@/components/StoreModal"

/**
 * ModalProvider component renders the StoreModal component on the client-side
 * after the server-side render has completed to prevent hydration errors.
 */
export default function ModalProvider() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return <StoreModal />
}
