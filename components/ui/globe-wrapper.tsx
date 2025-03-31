"use client"
import { useEffect, useRef, useState } from "react"
import { World } from "./globe"
import { useGlobeContext } from "../globe-context-provider"

interface GlobeWrapperProps {
  data: any[]
  globeConfig: any
}

export default function GlobeWrapper({ data, globeConfig }: GlobeWrapperProps) {
  const { globeNeedsReset } = useGlobeContext()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [key, setKey] = useState(0) // Used to force remount when needed

  // Handle globe reset when loader completes
  useEffect(() => {
    if (globeNeedsReset) {
      // Force a resize event to help Three.js recalculate dimensions
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("resize"))
      }

      // Force remount of the globe component to ensure clean WebGL context
      setKey((prev) => prev + 1)
    }
  }, [globeNeedsReset])

  return (
    <div ref={wrapperRef} className="w-full h-full">
      <World key={key} data={data} globeConfig={globeConfig} />
    </div>
  )
}

