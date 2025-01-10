"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from 'lucide-react'

interface BrandingProject {
  id: string
  Brand: string
  Description: string
  Logo: string | null
  Stats: {
    impression?: string
    interactions?: string
    reach?: string
  }
  banner: string
  highlighted: boolean
  tags: string[]
  Tags: string[]
  Status: string
  Images: string | null
}

interface BrandingProjectsProps {
  projects: BrandingProject[]
  filterTags?: string[]
}

export default function BrandingProjects({ projects, filterTags = [] }: BrandingProjectsProps) {
  const [hoveredProject, setHoveredProject] = useState<BrandingProject | null>(null)
  const [activeProject, setActiveProject] = useState<BrandingProject | null>(null)
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)

  const filteredProjects = filterTags.length
    ? projects.filter((project) => filterTags.every((tag) => [...project.tags, ...project.Tags].includes(tag)))
    : projects

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.highlighted && !b.highlighted) return -1
    if (!a.highlighted && b.highlighted) return 1
    return 0 
  })

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setActiveProject(null)
      }
    }

    if (activeProject) {
      document.addEventListener("mousedown", handleOutsideClick)
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
    }
  }, [activeProject])

  const handleMouseEnter = (project: BrandingProject) => {
    setHoveredProject(project)
  }

  const handleMouseLeave = () => {
    setHoveredProject(null)
  }

  const handleClick = (project: BrandingProject) => {
    setActiveProject(project)
  }

  return (
    <>
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activeProject && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${activeProject.id}-${id}`}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.05 } }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActiveProject(null)}
            >
              <X className="h-4 w-4" />
            </motion.button>
            <motion.div
              layoutId={`card-${activeProject.id}-${id}`}
              ref={ref}
              className="w-full max-w-[800px] h-[800px] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <div className="m-4">
                <motion.div layoutId={`image-${activeProject.id}-${id}`} className="relative h-[400px] overflow-hidden rounded-xl">
                  <Image
                    fill
                    src={activeProject.banner || activeProject.Images || "/placeholder.svg"}
                    alt={`${activeProject.Brand} - Full Image`}
                    className="object-cover object-top"
                  />
                </motion.div>
              </div>

              <div className="p-6 flex flex-col h-full">
                <div className="flex flex-row justify-between items-center">
                  <motion.h3
                    layoutId={`title-${activeProject.id}-${id}`}
                    className="font-medium text-2xl text-neutral-700 dark:text-neutral-200"
                  >
                    {activeProject.Brand}
                  </motion.h3>
                  
                  <motion.div 
                    layoutId={`logo-${activeProject.id}-${id}`} 
                    className="relative w-16 h-16 ml-4 flex-shrink-0"
                  >
                    <Image 
                      src={activeProject.Logo || "/placeholder.svg"} 
                      alt={`${activeProject.Brand} logo`} 
                      className="object-contain"
                      width={64}
                      height={64}
                    />
                  </motion.div>
                </div>
                
                <div className="mt-6 flex-grow flex flex-col">
                  <div className="flex flex-wrap gap-1 mb-4">
                    {[...activeProject.tags, ...activeProject.Tags].map((tag, index) => (
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
                    layoutId={`description-${activeProject.id}-${id}`}
                    className="flex-grow overflow-y-auto pr-2"
                  >
                    <p className="text-neutral-600 text-base lg:text-lg dark:text-neutral-400">
                      {activeProject.Description}
                    </p>
                  </motion.div>
                  <div className="mt-4">
                    <h4 className="font-medium text-lg mb-2">Stats</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {activeProject.Stats.impression && (
                        <div>
                          <p className="text-sm text-gray-500">Impressions</p>
                          <p className="text-lg font-medium">{activeProject.Stats.impression}</p>
                        </div>
                      )}
                      {activeProject.Stats.interactions && (
                        <div>
                          <p className="text-sm text-gray-500">Interactions</p>
                          <p className="text-lg font-medium">{activeProject.Stats.interactions}</p>
                        </div>
                      )}
                      {activeProject.Stats.reach && (
                        <div>
                          <p className="text-sm text-gray-500">Reach</p>
                          <p className="text-lg font-medium">{activeProject.Stats.reach}</p>
                        </div>
                      )}
                    </div>
                  </div>
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
            onClick={() => handleClick(project)}
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
                  src={project.banner || project.Images || "/placeholder.svg"}
                  alt={project.Brand}
                  className="object-cover object-top"
                />
              </motion.div>
            </motion.div>
            <div className="mt-4 flex justify-between items-center">
              <motion.h3
                layoutId={`title-${project.id}-${id}`}
                className="font-medium text-card-foreground text-lg"
              >
                {project.Brand}
              </motion.h3>
              <motion.div 
                layoutId={`logo-${project.id}-${id}`} 
                className="relative w-16 h-16 ml-4 flex-shrink-0"
              >
                <Image 
                  src={project.Logo || "/placeholder.svg"} 
                  alt={`${project.Brand} logo`} 
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
              {[...project.tags, ...project.Tags].slice(0, 3).map((tag, index) => (
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
              {[...project.tags, ...project.Tags].length > 3 && (
                <span className="text-muted-foreground text-xs">+{[...project.tags, ...project.Tags].length - 3} more</span>
              )}
            </div>
            <div className="mt-4 items-start">
              <button
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

