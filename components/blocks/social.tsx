"use client"

import Image from "next/image"
import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X, Instagram, Twitter, Facebook, Linkedin, LinkIcon, ChevronLeft, ChevronRight } from "lucide-react"

interface Social {
  id: string
  Brand: string
  Description: string
  Logo: string
  URL?: string[]
  banner: string
  archive: boolean
  highlighted: boolean
  tags: string[]
}

interface SocialProjectsProps {
  projects: Social[]
  filterTags?: string[]
}

export default function SocialProjects({ projects, filterTags = [] }: SocialProjectsProps) {
  const [active, setActive] = useState<Social | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [hoveredProject, setHoveredProject] = useState<Social | null>(null)
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)

  const filteredProjects =
    projects && filterTags.length
      ? projects.filter((project) => filterTags.every((tag) => project.tags.includes(tag)))
      : projects || []

  const sortedProjects = [...filteredProjects]
    .filter((project) => !project.archive)
    .sort((a, b) => {
      if (a.highlighted && !b.highlighted) return -1
      if (!a.highlighted && b.highlighted) return 1
      return 0
    })

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActive(null)
        setActiveIndex(-1)
      }
    }

    if (active) {
      document.addEventListener("mousedown", handleOutsideClick)
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [active])

  const handleMouseEnter = (project: Social) => {
    setHoveredProject(project)
  }

  const handleMouseLeave = () => {
    setHoveredProject(null)
  }

  const handleClick = (project: Social) => {
    if (active && active.id === project.id) {
      setActive(null)
      setActiveIndex(-1)
    } else {
      const index = sortedProjects.findIndex((p) => p.id === project.id)
      setActive(project)
      setActiveIndex(index)
    }
  }

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1)
      setActive(sortedProjects[activeIndex - 1])
    }
  }

  const handleNext = () => {
    if (activeIndex < sortedProjects.length - 1) {
      setActiveIndex(activeIndex + 1)
      setActive(sortedProjects[activeIndex + 1])
    }
  }

  const getSocialIcon = (url: string) => {
    if (url.includes("instagram")) return <Instagram className="w-6 h-6" />
    if (url.includes("twitter")) return <Twitter className="w-6 h-6" />
    if (url.includes("facebook")) return <Facebook className="w-6 h-6" />
    if (url.includes("linkedin")) return <Linkedin className="w-6 h-6" />
    return <LinkIcon className="w-6 h-6" />
  }

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 grid place-items-center z-[100]"
          >
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-[45vw] h-[85vh] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden shadow-lg border-4 border-gray-200 dark:border-gray-700 relative"
            >
              <motion.button
                key={`button-${active.id}-${id}`}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.05 } }}
                className="flex absolute top-4 right-4 items-center justify-center bg-white dark:bg-neutral-800 rounded-full h-8 w-8 shadow-md z-20"
                onClick={() => {
                  setActive(null)
                  setActiveIndex(-1)
                }}
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </motion.button>
              <div className="m-4">
                <motion.div
                  layoutId={`image-${active.id}-${id}`}
                  className="relative h-[400px] overflow-hidden rounded-xl"
                >
                  {active.banner ? (
                    <motion.div
                      animate={{
                        y: ["0%", "-62.5%", "-62.5%", "0%"],
                      }}
                      transition={{
                        y: {
                          duration: 20,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        },
                      }}
                      className="absolute inset-0 w-full"
                      style={{ height: "268.75%" }}
                    >
                      <Image
                        priority
                        fill
                        src={active.banner || "/placeholder.svg"}
                        alt={`${active.Brand} - Full Image`}
                        className="object-cover object-top"
                      />
                    </motion.div>
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="p-6 flex flex-col h-full">
                <div className="flex flex-row justify-between items-center">
                  <motion.h3
                    layoutId={`title-${active.id}-${id}`}
                    className="font-medium text-2xl text-neutral-700 dark:text-neutral-200"
                  >
                    {active.Brand}
                  </motion.h3>
                  {active.Logo && (
                    <motion.div layoutId={`logo-${active.id}-${id}`} className="relative w-16 h-16 ml-4 flex-shrink-0">
                      <Image
                        src={active.Logo || "/placeholder.svg"}
                        alt={`${active.Brand} logo`}
                        className="object-contain"
                        width={64}
                        height={64}
                      />
                    </motion.div>
                  )}
                </div>

                <div className="mt-6 flex-grow flex flex-col">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {active.tags.map((tag, index) => (
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
                  <motion.div layoutId={`description-${active.id}-${id}`} className="flex-grow overflow-y-auto pr-2">
                    <p className="text-neutral-600 text-base lg:text-lg dark:text-neutral-400">{active.Description}</p>
                  </motion.div>
                  <div className="mt-4 flex justify-center gap-4">
                    {active.URL?.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-orange-500 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {getSocialIcon(url)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={handlePrevious}
                disabled={activeIndex === 0}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-neutral-800 rounded-full p-2 shadow-md disabled:opacity-50 h-12 w-12 flex items-center justify-center"
              >
                <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={handleNext}
                disabled={activeIndex === sortedProjects.length - 1}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-neutral-800 rounded-full p-2 shadow-md disabled:opacity-50 h-12 w-12 flex items-center justify-center"
              >
                <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <ul className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 py-10">
        {sortedProjects.map((project) => (
          <motion.div
            key={project.id}
            onMouseEnter={() => handleMouseEnter(project)}
            onMouseLeave={handleMouseLeave}
            className="p-4 flex flex-col  h-[45vh] w-[20vw] md:h-[36vh] md:w[20vw] bg-card hover:bg-card/90 rounded-xl bg-neutral-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{
              zIndex: hoveredProject === project ? 20 : 1,
            }}
          >
            <motion.div
              layoutId={`image-${project.id}-${id}`}
              className="relative overflow-hidden rounded-xl"
              animate={{
                height: hoveredProject === project ? 300 : 192,
              }}
              transition={{ duration: 0.3 }}
            >
              {project.banner ? (
                <motion.div
                  animate={{
                    y: hoveredProject === project ? ["0%", "-62.5%", "-62.5%", "0%"] : "0%",
                  }}
                  transition={{
                    y: {
                      duration: hoveredProject === project ? 20 : 0,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                  }}
                  className="absolute inset-0 w-full"
                  style={{ height: "268.75%" }}
                >
                  <Image
                    fill
                    src={project.banner || "/placeholder.svg"}
                    alt={project.Brand}
                    className="object-cover object-top"
                  />
                </motion.div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </motion.div>
            <div className="mt-4 flex justify-between items-center">
              <motion.h3 layoutId={`title-${project.id}-${id}`} className="font-medium text-card-foreground text-lg">
                {project.Brand}
              </motion.h3>
              {project.Logo && (
                <motion.div layoutId={`logo-${project.id}-${id}`} className="relative w-16 h-16 ml-4 flex-shrink-0">
                  <Image
                    src={project.Logo || "/placeholder.svg"}
                    alt={`${project.Brand} logo`}
                    className="object-contain"
                    width={64}
                    height={64}
                  />
                </motion.div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag, index) => (
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
              {project.tags.length > 3 && (
                <span className="text-muted-foreground text-xs">+{project.tags.length - 3} more</span>
              )}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handleClick(project)}
                className="px-4 py-2 text-sm rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-colors duration-200"
              >
                View Details
              </button>
              <div className="flex gap-2">
                {project.URL?.slice(0, 3).map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {getSocialIcon(url)}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  )
}

