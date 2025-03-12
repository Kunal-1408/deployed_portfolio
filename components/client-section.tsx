"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "../components/hooks/use-media-query"

interface Client {
  logoUrl: string
  alt?: string
}

interface ClientLogosProps {
  clients: Client[]
  rowSize?: number
  rotationInterval?: number
  className?: string
}

export default function Clients({
  clients = [],
  rowSize = 5,
  rotationInterval = 8000,
  className,
}: ClientLogosProps) {
  // Responsive hooks
  const isMobile = useMediaQuery("(max-width: 640px)")
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)")

  // Adjust rows based on screen size
  const getResponsiveRows = () => {
    if (isMobile) return 2 // Show only 2 rows on mobile
    if (isTablet) return 4 // Show 4 rows on tablet
    return 6 // Show all 6 rows on desktop
  }

  const totalRows = getResponsiveRows()

  // Ensure we have valid clients data
  const safeClients = clients.length > 0 ? clients : [{ logoUrl: "/placeholder.svg", alt: "Placeholder" }]

  // Create a reference to track the current position in the clients array
  const clientIndexRef = useRef(0)

  // Responsive row size
  const responsiveRowSize = isMobile ? Math.min(2, rowSize) : rowSize

  // State for the grid of visible clients
  const gridSize = totalRows * responsiveRowSize

  // Initialize with the first set of clients
  const [visibleClients, setVisibleClients] = useState<Client[]>(() => {
    const initialClients: Client[] = []
    for (let i = 0; i < gridSize; i++) {
      initialClients.push(safeClients[i % safeClients.length])
    }
    return initialClients
  })

  // Update visible clients when screen size changes
  useEffect(() => {
    const newGridSize = totalRows * responsiveRowSize
    setVisibleClients((prev) => {
      const newClients: Client[] = []
      for (let i = 0; i < newGridSize; i++) {
        if (i < prev.length) {
          newClients.push(prev[i])
        } else {
          newClients.push(safeClients[i % safeClients.length])
        }
      }
      return newClients
    })
  }, [totalRows, responsiveRowSize, safeClients])

  // Track which row and column is currently being animated
  const [currentRow, setCurrentRow] = useState<number | null>(null)
  const [currentCol, setCurrentCol] = useState<number | null>(null)

  // Function to safely get the next client from the array
  const getNextClient = (): Client => {
    const nextIndex = (clientIndexRef.current + 1) % safeClients.length
    clientIndexRef.current = nextIndex
    return safeClients[nextIndex]
  }

  useEffect(() => {
    if (safeClients.length <= 1) return // Need at least 2 clients to animate

    let timeoutId: NodeJS.Timeout

    // Function to animate the next logo in sequence
    const animateNextLogo = (row: number, col: number) => {
      // Skip animation if row is beyond current totalRows
      if (row >= totalRows) {
        // Reset animation state
        setCurrentRow(null)
        setCurrentCol(null)

        // If we've gone through all clients, reset the index to ensure we start from the beginning
        if (clientIndexRef.current >= safeClients.length - 1) {
          clientIndexRef.current = -1 // Will become 0 on the first getNextClient call
        }

        timeoutId = setTimeout(() => {
          animateNextLogo(0, 0) // Start from the beginning
        }, rotationInterval)
        return
      }

      // Set current animation position
      setCurrentRow(row)
      setCurrentCol(col)

      // Calculate the index in the visibleClients array
      const index = row * responsiveRowSize + col

      // Update this specific client with the next one
      setVisibleClients((prev) => {
        const updated = [...prev]
        if (index < updated.length) {
          updated[index] = getNextClient()
        }
        return updated
      })

      // Determine the next position to animate
      let nextRow = row
      let nextCol = col + 1

      // If we reached the end of a row, move to the next row
      if (nextCol >= responsiveRowSize) {
        nextRow++
        nextCol = 0
      }

      // If we've gone through all rows, start a new cycle after a delay
      if (nextRow >= totalRows) {
        // Reset animation state
        setCurrentRow(null)
        setCurrentCol(null)

        timeoutId = setTimeout(() => {
          animateNextLogo(0, 0) // Start from the beginning
        }, rotationInterval)
      } else {
        // Otherwise, continue to the next position after a short delay
        timeoutId = setTimeout(() => {
          animateNextLogo(nextRow, nextCol)
        }, 300) // 300ms delay between each logo update
      }
    }

    // Start the animation sequence
    timeoutId = setTimeout(() => {
      // Initialize the animation starting point
      animateNextLogo(0, 0) // Start from the first logo in the first row
    }, rotationInterval)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [safeClients, responsiveRowSize, rotationInterval, totalRows])

  // Create grid layout
  const rows = []
  for (let i = 0; i < Math.min(visibleClients.length, gridSize); i += responsiveRowSize) {
    rows.push(visibleClients.slice(i, Math.min(i + responsiveRowSize, visibleClients.length)))
  }

  // If we have fewer rows than expected, pad with empty rows
  while (rows.length < totalRows) {
    rows.push(Array(responsiveRowSize).fill({ logoUrl: "/placeholder.svg", alt: "Placeholder" }))
  }

  return (
    <div className={cn("w-full py-8 md:py-12 lg:py-16 bg-white", className)}>
      <div className="container mx-auto px-4">
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8 items-center justify-items-center"
            >
              {row.map((client, colIndex) => {
                const isAnimating = currentRow === rowIndex && currentCol === colIndex

                return (
                  <div key={`client-wrapper-${rowIndex}-${colIndex}`} className="w-full h-14 sm:h-16 md:h-18 lg:h-20">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${isAnimating ? "animating" : "static"}-${rowIndex}-${colIndex}-${client.logoUrl}`}
                        initial={{ rotateX: 90, opacity: 0 }}
                        animate={{ rotateX: 0, opacity: 1 }}
                        exit={{ rotateX: -90, opacity: 0 }}
                        transition={{
                          duration: 0.7,
                          ease: "easeInOut",
                        }}
                        className="w-full h-full flex items-center justify-center perspective-500"
                      >
                        <div className="relative w-full h-full flex items-center justify-center">
                          <Image
                            src={client.logoUrl || "/placeholder.svg"}
                            alt={client.alt || "Client logo"}
                            fill
                            className="object-contain p-2"
                          />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

