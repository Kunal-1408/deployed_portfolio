"use client"

import { useMemo } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Client {
  logoUrl: string
  alt?: string
}

interface ClientLogosProps {
  clients: Client[]
  className?: string
}

export default function Clients({ clients = [], className }: ClientLogosProps) {
  // Ensure we have valid clients data
  const safeClients = clients.length > 0 ? clients : [{ logoUrl: "/placeholder.svg", alt: "Placeholder" }]

  // Fixed grid dimensions
  const rowSize = 6
  const totalRows = 6
  const totalLogos = rowSize * totalRows // 36 logos total

  // Generate the grid of logos
  const logoGrid = useMemo(() => {
    const grid: Client[] = []

    // Fill the grid with clients, cycling through the array if needed
    for (let i = 0; i < totalLogos; i++) {
      grid.push(safeClients[i % safeClients.length])
    }

    return grid
  }, [safeClients, totalLogos])

  // Create rows for the grid
  const rows = []
  for (let i = 0; i < totalLogos; i += rowSize) {
    rows.push(logoGrid.slice(i, i + rowSize))
  }

  return (
    <div className={cn("w-full py-8 md:py-12 lg:py-16 bg-white", className)}>
      <div className="container mx-auto px-4">
        <div className="space-y-6 md:space-y-8 lg:space-y-10">
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 items-center justify-items-center"
            >
              {row.map((client, colIndex) => (
                <div
                  key={`client-${rowIndex}-${colIndex}`}
                  className="w-full h-14 sm:h-16 md:h-18 lg:h-20 border rounded-md p-2 flex items-center justify-center"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={client.logoUrl || "/placeholder.svg"}
                      alt={client.alt || "Client logo"}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

