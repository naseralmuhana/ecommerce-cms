"use client"

import { useEffect, useState } from "react"

/**
 * Custom hook to retrieve the current origin of the window.
 * Returns an empty string until the component is mounted.
 */
export default function useOrigin() {
  const [mounted, setMounted] = useState(false)

  // Calculate the current origin of the window.
  // If window.location.origin is available, use it; otherwise, use an empty string.
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : ""

  // Effect to set the "mounted" state to true once the component is mounted.
  useEffect(() => {
    // This ensures that the code below, which depends on component mounting,
    // is only executed after the initial render.
    setMounted(true)
  }, [])

  // If the component is not yet mounted, return an empty string.
  if (!mounted) return ""

  // Return the calculated origin.
  return origin
}
