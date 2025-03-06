"use client"

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
            <motion.div className="fixed inset-0 flex items-center justify-center z-[60]" onClick={handleClose}>
              <motion.div
                layoutId={`card-${active.id}-${id}`}
                ref={ref}
                className=" w-[45vw] h-[85vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden relative border-4 border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  key={`button-${active.id}-${id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute top-4 right-4 z-50 bg-gray-400 rounded-full p-2"
                  onClick={handleClose}
                >
                  <X className="h-6 w-6 text-white" />
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </motion.button>
                )}
                <div className="h-full overflow-y-auto">
                  <div className="m-4">
                    <motion.div
                      layoutId={`image-${active.id}-${id}`}
                      className="relative h-[400px] overflow-hidden rounded-xl"
                    >
                      <motion.div
                        animate={{
                          y: ["0%", "-50%", "-50%", "0%"],
                        }}
                        transition={{
                          y: {
                            duration: 20,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                          },
                        }}
                        className="absolute inset-0 w-full"
                        style={{ height: "200%" }}
                      >
                        <Image
                          priority
                          fill
                          src={active.Images || "/placeholder.svg"}
                          alt={`${active.Title} - Full Image`}
                          className="object-cover object-top"
                        />
                      </motion.div>
                    </motion.div>
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex flex-row justify-between items-center">
                        <motion.h3
                          layoutId={`title-${active.id}-${id}`}
                          className="font-medium text-card-foreground text-lg"
                        >
                          {active.Title}
                        </motion.h3>
                        <motion.div
                          layoutId={`logo-${active.id}-${id}`}
                          className="relative w-16 h-16 ml-4 flex-shrink-0 rounded-full overflow-hidden"
                        >
                          <Image
                            src={active.Logo || "/placeholder.svg"}
                            alt={`${active.Title} logo`}
                            className="object-contain"
                            fill
                          />
                        </motion.div>
                      </div>

                      <div className="mt-6 flex-grow flex flex-col">
                        <div className="flex flex-wrap gap-1 mb-4">
                          {active.Tags.map((tag, index) => (
                            <motion.span
                              key={`${tag}-${index}-${id}`}
                              className="bg-white/0.2 text-gray-800 text-sm font-medium px-3 py-1 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
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
                        <motion.div className="flex-grow overflow-y-auto pr-2">
                          <p className="text-neutral-600 text-base lg:text-lg dark:text-neutral-400">
                            {active.Description}
                          </p>
                        </motion.div>
                      </div>
                    </div>
                    <div className="absolute left-4 bottom-4">
                      {active.URL && (
                        <motion.a
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          href={active.URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-6 py-3 text-base rounded-full font-bold text-white bg-orange-400 hover:bg-orange-500 text-primary-foreground"
                        >
                          Visit Website
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <ul className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 py-10">
        {sortedWebsites.map((website) => (
          <motion.div
            key={website.id}
            onMouseEnter={() => handleMouseEnter(website)}
            onMouseLeave={handleMouseLeave}
            className="p-4 flex flex-col h-[45vh] w-[20vw] md:h-[36vh] md:w[20vw] bg-card hover:bg-card/90 rounded-xl bg-neutral-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{
              zIndex: hoveredWebsite === website ? 20 : 1,
            }}
          >
            <motion.div
              layoutId={`image-${website.id}-${id}`}
              className="relative overflow-hidden rounded-xl"
              animate={{
                height: hoveredWebsite === website ? 300 : 200,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{
                  y: hoveredWebsite === website ? ["0%", "-50%", "-50%", "0%"] : "0%",
                }}
                transition={{
                  y: {
                    duration: hoveredWebsite === website ? 20 : 0,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  },
                }}
                className="absolute inset-0 w-full"
                style={{ height: "200%" }}
              >
                <Image
                  fill
                  src={website.Images || "/placeholder.svg"}
                  alt={website.Title}
                  className="object-cover object-top"
                />
              </motion.div>
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

