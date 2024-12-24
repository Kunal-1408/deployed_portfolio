"use client"

import Image from "next/image"
import Link from "next/link"
import React, { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

interface BrandingProject {
  id: string
  Brand: string
  Description: string
  Logo: string
  Stats: {
    impression?: string
    interactions?: string
    reach?: string
  }
  banner: string
  highlighted: boolean
  tags: string[]
}

interface BrandingProjectsProps {
  projects: BrandingProject[]
  filterTags?: string[]
}

export default function BrandingProjects({ projects, filterTags = [] }: BrandingProjectsProps) {
  const [hoveredProject, setHoveredProject] = useState<BrandingProject | null>(null)
  const id = useId()

  const filteredProjects = filterTags.length
    ? projects.filter((project) => filterTags.every((tag) => project.tags.includes(tag)))
    : projects

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.highlighted && !b.highlighted) return -1
    if (!a.highlighted && b.highlighted) return 1
    return 0 
  })

  const handleMouseEnter = (project: BrandingProject) => {
    setHoveredProject(project)
  }

  const handleMouseLeave = () => {
    setHoveredProject(null)
  }

  return (
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
                src={project.banner}
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
                src={project.Logo} 
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
            <Link href={`/works/brands/${project.id}`}>
              <button
                className="px-4 py-2 mr-3 text-sm rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-colors duration-200"
              >
                View Details
              </button>
            </Link>
          </div>
        </motion.div>
      ))}
    </ul>
  )
}