"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function Loading() {
  const [loading, setLoading] = useState(true)
  const [animationComplete, setAnimationComplete] = useState(false)

  // Minimum display time for the loader (in milliseconds)
  const minimumLoadingTime = 4000

  useEffect(() => {
    // Timer to ensure minimum display time
    const timer = setTimeout(() => {
      setLoading(false)
    }, minimumLoadingTime)

    // Cleanup function
    return () => {
      clearTimeout(timer)
    }
  }, [])

  // Handle animation completion
  useEffect(() => {
    if (!loading) {
      // Add a delay before completely removing the loader
      const animationTimer = setTimeout(() => {
        setAnimationComplete(true)
      }, 4000) // This should match the duration of your fade-out animation

      return () => {
        clearTimeout(animationTimer)
      }
    }
  }, [loading])

  // If animation is complete, don't render anything
  if (animationComplete) {
    return null
  }

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-white z-50 transition-opacity duration-500 ${
        loading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`relative transition-all duration-1000 ease-in-out ${
          loading ? "scale-100 opacity-100" : "scale-150 opacity-0"
        }`}
      >
        <div className="relative">
          {/* Logo with shimmer effect */}
          <Image
            src="https://quitegood.s3.eu-north-1.amazonaws.com/Logo-01.png"
            alt="Quite Good Portfolio Logo"
            width={500}
            height={250}
            priority
            className={`relative z-10 ${loading ? "animate-shimmer" : ""}`}
          />

          {/* Shimmer overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent shimmer-effect"></div>
        </div>
      </div>
    </div>
  )
}

