"use client"

import Image from "next/image"
import { useId, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

interface LogoSection {
  logo: string
  description: string
}

interface BannerSection {
  description: string
  banners: string[]
}

interface StandeeSection {
  description: string
  standees: string[]
}

interface CardSection {
  description: string
  card: string[] // Will contain exactly 2 strings [front, back]
}

interface GoodiesSection {
  description: string
  goodies: string[]
}

interface BrandingProject {
  id: string
  title?: string
  description?: string
  clientName?: string
  logoSection?: LogoSection
  bannerSection?: BannerSection
  standeeSection?: StandeeSection
  cardSection?: CardSection
  goodiesSection?: GoodiesSection
  tags: string[]
  archive?: boolean
  highlighted: boolean

  // Legacy fields
  Brand?: string
  Description?: string
  Logo?: string | null
  Stats?: {
    impression?: string
    interactions?: string
    reach?: string
  }
  banner?: string
  Tags?: string[]
  Status?: string
  Images?: string | null
}

interface BrandingProjectsProps {
  projects: BrandingProject[]
  filterTags?: string[]
}

export default function BrandingProjects({ projects, filterTags = [] }: BrandingProjectsProps) {
  const [hoveredProject, setHoveredProject] = useState<BrandingProject | null>(null)
  const id = useId()
  const router = useRouter()

  // Helper function to get the appropriate display values
  const getDisplayValues = (project: BrandingProject) => {
    return {
      title: project.title || project.Brand || "",
      description: project.description || project.Description || "",
      logo: project.logoSection?.logo || project.Logo || "/placeholder.svg",
      banner: project.bannerSection?.banners?.[0] || project.banner || project.Images || "/placeholder.svg",
      tags: [...(project.tags || []), ...(project.Tags || [])],
      stats: project.Stats || { impression: "N/A", interactions: "N/A", reach: "N/A" },
    }
  }

  const filteredProjects = filterTags.length
    ? projects.filter((project) => {
        const allTags = [...(project.tags || []), ...(project.Tags || [])]
        return filterTags.every((tag) => allTags.includes(tag))
      })
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

  const handleViewDetails = (project: BrandingProject) => {
    router.push(`/works/brands/${project.id}`)
  }

  return (
    <ul className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 py-10">
      {sortedProjects.map((project) => {
        const { title, description, logo, banner, tags } = getDisplayValues(project)

        return (
          <motion.div
            key={project.id}
            onMouseEnter={() => handleMouseEnter(project)}
            onMouseLeave={handleMouseLeave}
            className="p-4 flex flex-col h-[400px] w-[350px] md:h-[350px] md:w[200px] bg-card hover:bg-card/90 rounded-xl bg-neutral-100 cursor-pointer shadow-sm transition-shadow duration-200"
            style={{
              zIndex: hoveredProject === project ? 20 : 1,
            }}
          >
            <motion.div
              layoutId={`image-${project.id}-${id}`}
              className="relative overflow-hidden rounded-xl"
              animate={{
                height: hoveredProject === project ? 300 : 200,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div className="absolute inset-0 w-full" style={{ height: "268.75%" }}>
                <Image fill src={banner || "/placeholder.svg"} alt={title} className="object-cover object-top" />
              </motion.div>
            </motion.div>
            <div className="mt-4 flex justify-between items-center">
              <motion.h3 layoutId={`title-${project.id}-${id}`} className="font-medium text-card-foreground text-lg">
                {title}
              </motion.h3>
              <motion.div layoutId={`logo-${project.id}-${id}`} className="relative w-16 h-16 ml-4 flex-shrink-0">
                <Image
                  src={logo || "/placeholder.svg"}
                  alt={`${title} logo`}
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
              {description}
            </motion.p>
            <div className="mt-3 flex flex-wrap gap-1">
              {tags.slice(0, 3).map((tag, index) => (
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
              {tags.length > 3 && <span className="text-muted-foreground text-xs">+{tags.length - 3} more</span>}
            </div>
            <div className="mt-4 items-start">
              <button
                onClick={() => handleViewDetails(project)}
                className="px-4 py-2 mr-3 text-sm rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          </motion.div>
        )
      })}
    </ul>
  )
}
