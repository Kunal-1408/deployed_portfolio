"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Create a context to track WebGL context state
type GlobeContextType = {
  resetGlobeContext: () => void
  globeNeedsReset: boolean
}

const GlobeContext = createContext<GlobeContextType>({
  resetGlobeContext: () => {},
  globeNeedsReset: false,
})

export const useGlobeContext = () => useContext(GlobeContext)

export function GlobeContextProvider({ children }: { children: ReactNode }) {
  const [globeNeedsReset, setGlobeNeedsReset] = useState(false)

  // Function to trigger a globe reset
  const resetGlobeContext = () => {
    setGlobeNeedsReset(true)

    // Reset the flag after a short delay
    setTimeout(() => {
      setGlobeNeedsReset(false)
    }, 100)
  }


  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // When tab becomes visible again, trigger a reset
        resetGlobeContext()
      }
    }

    // Listen for resize events to help with WebGL context
    const handleResize = () => {
      resetGlobeContext()
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("resize", handleResize)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <GlobeContext.Provider value={{ resetGlobeContext, globeNeedsReset }}>{children}</GlobeContext.Provider>
}

