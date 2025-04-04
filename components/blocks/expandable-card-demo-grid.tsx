"use client"

import type React from "react"

import Image from "next/image"
import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface Website {
  id: string
  Title: string
  Description: string
  Status: string
  URL: string | null
  Tags: string[]
  Backup_Date: string | null
  Content_Update_Date: string | null
  archive: boolean
  highlighted: boolean
  Images: string | null
  Logo: string | null
}

interface ExpandableCardDemoProps {
  websites: Website[]
  filterTags?: string[]
}

export default function ExpandableCardDemo({ websites, filterTags = [] }: ExpandableCardDemoProps) {
  const [active, setActive] = useState<Website | null>(null)
  const [hoveredWebsite, setHoveredWebsite] = useState<Website | null>(null)
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)

  const filteredWebsites = filterTags.length
    ? websites.filter((website) => !website.archive && filterTags.every((tag) => website.Tags.includes(tag)))
    : websites.filter((website) => !website.archive)

  const sortedWebsites = [...filteredWebsites]
    .filter((website) => !website.archive)
    .sort((a, b) => {
      if (a.highlighted && !b.highlighted) return -1
      if (!a.highlighted && b.highlighted) return 1
      return 0
    })

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose()
      }
    }

    if (active) {
      document.body.style.overflow = "hidden"
      document.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.body.style.overflow = "auto"
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [active])

  const handleMouseEnter = (website: Website) => {
    setHoveredWebsite(website)
  }

  const handleMouseLeave = () => {
    setHoveredWebsite(null)
  }

  const handleClick = (website: Website) => {
    setActive(website)
  }

  const currentIndex = sortedWebsites.findIndex((website) => website.id === active?.id)

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentIndex > 0) {
      setActive(sortedWebsites[currentIndex - 1])
    }
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (currentIndex < sortedWebsites.length - 1) {
      setActive(sortedWebsites[currentIndex + 1])
    }
  }

  const handleClose = () => {
    document.body.style.overflow = "auto"
    setActive(null)
  }

  return (
    <>
      <style jsx global>{`
        @keyframes scrollImage {
          0% { transform: translateY(0); }
          45% { transform: translateY(calc(-100% + 350px)); }
          55% { transform: translateY(calc(-100% + 350px)); }
          100% { transform: translateY(0); }
        }
        
        @keyframes scrollImageMobile {
          0% { transform: translateY(0); }
          45% { transform: translateY(calc(-100% + 200px)); }
          55% { transform: translateY(calc(-100% + 200px)); }
          100% { transform: translateY(0); }
        }
        
        @keyframes scrollImageTablet {
          0% { transform: translateY(0); }
          45% { transform: translateY(calc(-100% + 250px)); }
          55% { transform: translateY(calc(-100% + 250px)); }
          100% { transform: translateY(0); }
        }
        
        .modal-image-scroll {
          animation: scrollImageMobile 60s infinite linear;
        }
        
        @media (min-width: 640px) {
          .modal-image-scroll {
            animation: scrollImageTablet 60s infinite linear;
          }
        }
        
        @media (min-width: 768px) {
          .modal-image-scroll {
            animation: scrollImage 60s infinite linear;
          }
        }
        
        .card-image-scroll {
          animation: none;
        }
        
        .card-image-scroll.hovered {
          animation: scrollImage 40s infinite linear;
        }
      `}</style>
      <AnimatePresence mode="wait">
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              onClick={handleClose}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-[60] p-2 sm:p-4"
              onClick={handleClose}
            >
              <motion.div
                layoutId={`card-${active.id}-${id}`}
                ref={ref}
                className="w-full max-w-[95vw] sm:max-w-[85vw] md:max-w-[75vw] lg:max-w-[45vw] max-h-[95vh] flex flex-col bg-white dark:bg-neutral-900 rounded-xl sm:rounded-3xl overflow-hidden relative border-4 border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  key={`button-${active.id}-${id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 bg-gray-400 rounded-full p-1.5 sm:p-2"
                  onClick={handleClose}
                >
                  
                  <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </motion.button>
                {currentIndex > 0 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handlePrevious(e)
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-full p-1 sm:p-2 shadow-lg hover:bg-gray-50 transition-colors h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center"
                  >
                    <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.button>
                )}
                {currentIndex < sortedWebsites.length - 1 && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNext(e)
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-full p-1 sm:p-2 shadow-lg hover:bg-gray-50 transition-colors h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center"
                  >
                    <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </motion.button>
                )}
                <div className="overflow-y-auto flex-grow">
                  <div className="p-2 sm:p-4">
                    <motion.div
                      layoutId={`image-${active.id}-${id}`}
                      className="relative h-[200px] sm:h-[250px] md:h-[350px] overflow-hidden rounded-xl"
                    >
                      <div className="modal-image-scroll w-full absolute">
                        <Image
                          priority
                          width={1200}
                          height={2400}
                          src={active.Images || "/placeholder.svg"}
                          alt={`${active.Title} - Full Image`}
                          className="w-full object-cover object-top"
                        />
                      </div>
                    </motion.div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="flex flex-row justify-between items-center">
                      <motion.h3
                        layoutId={`title-${active.id}-${id}`}
                        className="font-medium text-card-foreground text-base sm:text-lg"
                      >
                        {active.Title}
                      </motion.h3>
                      <motion.div
                        layoutId={`logo-${active.id}-${id}`}
                        className="relative w-12 h-12 sm:w-16 sm:h-16 ml-4 flex-shrink-0 rounded-full overflow-hidden"
                      >
                        <Image
                          src={active.Logo || "/placeholder.svg"}
                          alt={`${active.Title} logo`}
                          className="object-contain"
                          fill
                        />
                      </motion.div>
                    </div>

                    <div className="mt-4 flex flex-col">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {active.Tags.map((tag, index) => (
                          <motion.span
                            key={`${tag}-${index}-${id}`}
                            className="bg-white/0.2 text-gray-800 text-xs sm:text-sm font-medium px-5 py-0.5 sm:px-3 sm:py-1 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500 hover:shadow-[4px_4px_0px_0px_rgba(249,105,14)] transition duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{
                              duration: 0.05,
                              ease: "easeInOut",
                            }}
                          >
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                      <div className="mb-4">
                        <p className="text-neutral-600 text-sm sm:text-base lg:text-lg dark:text-neutral-400">
                          {active.Description}
                        </p>
                      </div>
                    </div>
                  </div>
                  {active.URL && (
                    <div className="p-3 sm:p-4 md:p-6 pt-0">
                      <motion.a
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        href={active.URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full font-bold text-white bg-orange-400 hover:bg-orange-500 text-primary-foreground"
                      >
                        Visit Website
                      </motion.a>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Optimized grid for smaller viewports - Changed from fixed grid-cols to responsive grid */}
      <ul className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 py-10">
        {sortedWebsites.map((website) => (
          <motion.div
            key={website.id}
            onMouseEnter={() => handleMouseEnter(website)}
            onMouseLeave={handleMouseLeave}
            className="p-4 flex flex-col h-auto w-full bg-card hover:bg-card/90 rounded-xl bg-neutral-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{
              zIndex: hoveredWebsite === website ? 20 : 1,
            }}
          >
            <motion.div
              layoutId={`image-${website.id}-${id}`}
              className="relative overflow-hidden rounded-xl"
              animate={{
                height: hoveredWebsite === website ? 300 : 220,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className={`card-image-scroll w-full absolute ${hoveredWebsite === website ? "hovered" : ""}`}>
                <Image
                  width={800}
                  height={1600}
                  src={website.Images || "/placeholder.svg"}
                  alt={website.Title}
                  className="w-full object-cover object-top"
                />
              </div>
            </motion.div>
            <div className="mt-4 flex justify-between items-center">
              <motion.h3 layoutId={`title-${website.id}-${id}`} className="font-medium text-card-foreground text-lg">
                {website.Title}
              </motion.h3>
              <motion.div
                layoutId={`logo-${website.id}-${id}`}
                className="relative w-16 h-16 ml-4 flex-shrink-0 rounded-full overflow-hidden"
              >
                <Image
                  src={website.Logo || "/placeholder.svg"}
                  alt={`${website.Title} logo`}
                  className="object-contain"
                  fill
                />
              </motion.div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {website.Tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={`${tag}-${index}-${id}`}
                  className="bg-white/0.2 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    duration: 0.05,
                    ease: "easeInOut",
                  }}
                >
                  {tag}
                </motion.span>
              ))}
              {website.Tags.length > 3 && (
                <span className="text-muted-foreground text-xs">+{website.Tags.length - 3} more</span>
              )}
            </div>
            <div className="mt-4 items-start">
              <button
                onClick={() => handleClick(website)}
                className="px-4 py-2 mr-3 text-sm rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-colors duration-200"
              >
                View Details
              </button>
              {website.URL && (
                <motion.a
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  href={website.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 text-sm rounded-full font-bold text-white bg-orange-400 hover:bg-orange-500 text-primary-foreground"
                >
                  Visit Website
                </motion.a>
              )}
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  )
}

