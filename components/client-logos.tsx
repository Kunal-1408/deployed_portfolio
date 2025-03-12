"use client"

import { Marquee } from "@/components/ui/marquee"
import Clients from "./client-section"

interface ClientLogosProps {
  content: Array<{ src: string; alt: string }> | null
  error?: string
}

export default function ClientLogos({ content, error }: ClientLogosProps) {
  console.log("ClientLogos content:", content) // Add this line for debugging
  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!content || content.length === 0) {
    return null
  }

  return <Clients clients={content} rowSize={5} rotationInterval={5000} />
}

