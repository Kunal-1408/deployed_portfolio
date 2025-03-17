"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function Loading() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      
      <div
        className={`absolute inset-0 bg-white flex items-center justify-center transition-opacity duration-1000 ease-in-out ${
          isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative w-64 h-24 md:w-80 md:h-32">
          <Image
            src="https://quitegood.s3.eu-north-1.amazonaws.com/Logo-01.png"
            alt="Quite Good Portfolio Logo"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>

    </div>
  )
}

