"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"
import { useEffect } from "react"

interface ImageLightboxProps {
  images: Array<{
    src: string
    alt: string
  }>
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export function ImageLightbox({ images, currentIndex, onClose, onNavigate }: ImageLightboxProps) {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onNavigate(currentIndex - 1)
      if (e.key === "ArrowRight") onNavigate(currentIndex + 1)
    }

    document.addEventListener("keydown", handleKeydown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeydown)
      document.body.style.overflow = "auto"
    }
  }, [currentIndex, onClose, onNavigate])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <div className="absolute top-4 right-4 z-50">
          <button onClick={onClose} className="p-2 text-white/70 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {/* Navigation Buttons */}
          {currentIndex > 0 && (
            <button
              onClick={() => onNavigate(currentIndex - 1)}
              className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors z-50"
            >
              <ChevronLeft size={36} />
            </button>
          )}

          {currentIndex < images.length - 1 && (
            <button
              onClick={() => onNavigate(currentIndex + 1)}
              className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors z-50"
            >
              <ChevronRight size={36} />
            </button>
          )}

          {/* Current Image */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full flex items-center justify-center p-8"
          >
            <div className="relative max-w-5xl w-full h-full">
              <Image
                src={images[currentIndex].src || "/placeholder.svg"}
                alt={images[currentIndex].alt}
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 font-light">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

