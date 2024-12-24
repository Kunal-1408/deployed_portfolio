"use client"

import Image from "next/image"
import React, { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

interface DesignProject {
  id: string
  Banner: string
  Brands: string
  Description: string
  Logo: string
  Type: string
  highlighted: boolean
  tags: string[]
}

interface DesignProjectsProps {
  projects: DesignProject[]
  filterTags?: string[]
}

export default function DesignProjects({ projects, filterTags = [] }: DesignProjectsProps) {
  const [active, setActive] = useState<DesignProject | null>(null)
  const [hoveredProject, setHoveredProject] = useState<DesignProject | null>(null)
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)

  const filteredProjects = filterTags.length
    ? projects.filter((project) => filterTags.every((tag) => project.tags.includes(tag)))
    : projects

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.highlighted && !b.highlighted) return -1
    if (!a.highlighted && b.highlighted) return 1
    return 0 
  })

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActive(null)
      }
    }

    if (active) {
      document.addEventListener("mousedown", handleOutsideClick)
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [active])

  const handleMouseEnter = (project: DesignProject) => {
    setHoveredProject(project)
  }

  const handleMouseLeave = () => {
    setHoveredProject(null)
  }

  const handleClick = (project: DesignProject) => {
    setActive(project)
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
      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <X className="h-4 w-4" />
            </motion.button>
            <motion.div
              layoutId={`card-${active.id}-${id}`}
              ref={ref}
              className="w-full max-w-[800px] h-[800px] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <div className="m-4">
                <motion.div layoutId={`image-${active.id}-${id}`} className="relative h-[400px] overflow-hidden rounded-xl">
                  <motion.div
                    animate={{
                      y: ["0%", "-62.5%", "-62.5%", "0%"],
                    }}
                    transition={{
                      y: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    }}
                    className="absolute inset-0 w-full"
                    style={{ height: "268.75%" }}  
                  >
                    <Image
                      priority
                      fill
                      src={active.Banner}
                      alt={`${active.Brands} - Full Image`}
                      className="object-cover object-top"
                    />
                  </motion.div>
                </motion.div>
              </div>

              <div className="p-6 flex flex-col h-full">
                <div className="flex flex-row justify-between items-center">
                  <motion.h3
                    layoutId={`title-${active.id}-${id}`}
                    className="font-medium text-2xl text-neutral-700 dark:text-neutral-200"
                  >
                    {active.Brands}
                  </motion.h3>
                  <span className="px-2 py-1 text-sm rounded-full bg-gray-200 text-gray-800">
                    {active.Type}
                  </span>
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
                          ease: "easeInOut"  
                        }}
                      >
                        {tag}
                      </motion.span>
                    ))}
                  </div>
                  <motion.div
                    layoutId={`description-${active.id}-${id}`}
                    className="flex-grow overflow-y-auto pr-2"
                  >
                    <p className="text-neutral-600 text-base lg:text-lg dark:text-neutral-400">
                      {active.Description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ul className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 py-10">
      {sortedProjects.map((project) => (
          <motion.div
            key={project.id}
            onMouseEnter={() => handleMouseEnter(project)}
            onMouseLeave={handleMouseLeave}
            className="p-4 flex flex-col h-[450px] w-[400px] md:h-[400px] md:w[250px] bg-card hover:bg-card/90 rounded-xl bg-neutral-100 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-200"
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
              <motion.div
                animate={{
                  y: hoveredProject === project ? ["0%", "-62.5%", "-62.5%", "0%"] : "0%",
                }}
                transition={{
                  y: {
                    duration: hoveredProject === project ? 20 : 0,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
                className="absolute inset-0 w-full"
                style={{ height: "268.75%" }}
              >
                <Image
                  fill
                  src={project.Banner}
                  alt={project.Brands}
                  className="object-cover object-top"
                />
              </motion.div>
            </motion.div>
            <div className="mt-4 flex justify-between items-center">
              <motion.h3
                layoutId={`title-${project.id}-${id}`}
                className="font-medium text-card-foreground text-lg"
              >
                {project.Brands}
              </motion.h3>
              <motion.div 
                layoutId={`logo-${project.id}-${id}`} 
                className="relative w-16 h-16 ml-4 flex-shrink-0"
              >
                <Image 
                  src={project.Logo} 
                  alt={`${project.Brands} logo`} 
                  className="object-contain"
                  width={64}
                  height={64}
                />
              </motion.div>
            </div>
            <motion.p
              layoutId={`description-${project.id}-${id}`}
              className="text-muted-foreground text-sm mt-2 line-clamp-2 h-10 overflow-hidden"
            >
              {project.Description}
            </motion.p>
            <div className="mt-3 flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag, index) => (
                <motion.span
                  key={`${tag}-${index}-${id}`}
                  className="bg-white/0.2 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    duration: 0.05,   
                    ease: "easeInOut"  
                  }}
                >
                  {tag}
                </motion.span>
              ))}
              {project.tags.length > 3 && (
                <span className="text-muted-foreground text-xs">+{project.tags.length - 3} more</span>
              )}
            </div>
            <div className="mt-4 items-start">
              <button
                onClick={() => handleClick(project)}
                className="px-4 py-2 mr-3 text-sm rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  )
}