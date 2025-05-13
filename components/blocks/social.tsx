"use client"

import Image from "next/image"
import { useId, useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Instagram, Twitter, Facebook, Linkedin, LinkIcon } from "lucide-react"

interface SocialPlatform {
  name: string
  url: string
  handle: string
  followers?: number
  engagement?: number
  description?: string
}

interface SocialMediaSection {
  description: string
  platforms: SocialPlatform[]
}

interface LogoSection {
  logo: string
  description: string
}

interface BannerSection {
  description: string
  banners: string[]
}

interface AnalyticsSection {
  description: string
  metrics: {
    name: string
    value: string
    change?: number
    period?: string
  }[]
}

interface CampaignSection {
  description: string
  campaigns: {
    name: string
    description: string
    startDate?: string
    endDate?: string
    status: string
    results?: string
    images: string[]
  }[]
}

interface Social {
  id: string
  title: string
  description: string
  clientName?: string
  logoSection: LogoSection
  bannerSection: BannerSection
  socialMediaSection: SocialMediaSection
  analyticsSection?: AnalyticsSection
  campaignSection?: CampaignSection
  tags: string[]
  archive: boolean
  highlighted: boolean

  // Legacy fields for compatibility
  Brand?: string
  Description?: string
  Logo?: string | null
  URL?: string[]
  banner?: string
  Tags?: string[]
}

interface SocialProjectsProps {
  projects: Social[]
  filterTags?: string[]
}

export default function SocialProjects({ projects, filterTags = [] }: SocialProjectsProps) {
  const [hoveredProject, setHoveredProject] = useState<Social | null>(null)
  const id = useId()
  const router = useRouter()

  // Helper function to get the appropriate display values
  const getDisplayValues = (project: Social) => {
    return {
      title: project.title || project.Brand || "",
      description: project.description || project.Description || "",
      logo: project.logoSection?.logo || project.Logo || "/placeholder.svg",
      banner: project.bannerSection?.banners?.[0] || project.banner || "/placeholder.svg",
      tags: [...(project.tags || []), ...(project.Tags || [])],
      urls: project.socialMediaSection?.platforms?.map((p) => p.url) || project.URL || [],
    }
  }

  const filteredProjects = filterTags.length
    ? projects.filter((project) => {
        const allTags = [...(project.tags || []), ...(project.Tags || [])]
        return filterTags.every((tag) => allTags.includes(tag))
      })
    : projects

  const sortedProjects = [...filteredProjects]
    .filter((project) => !project.archive)
    .sort((a, b) => {
      if (a.highlighted && !b.highlighted) return -1
      if (!a.highlighted && b.highlighted) return 1
      return 0
    })

  const handleMouseEnter = (project: Social) => {
    setHoveredProject(project)
  }

  const handleMouseLeave = () => {
    setHoveredProject(null)
  }

  const handleViewDetails = (project: Social) => {
    router.push(`/works/social/${project.id}`)
  }

  const getSocialIcon = (url: string) => {
    if (url.includes("instagram")) return <Instagram className="w-6 h-6" />
    if (url.includes("twitter")) return <Twitter className="w-6 h-6" />
    if (url.includes("facebook")) return <Facebook className="w-6 h-6" />
    if (url.includes("linkedin")) return <Linkedin className="w-6 h-6" />
    return <LinkIcon className="w-6 h-6" />
  }

  return (
    <ul className="max-w-7xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 py-10">
      {sortedProjects.map((project) => {
        const { title, description, logo, banner, tags, urls } = getDisplayValues(project)

        return (
          <motion.div
            key={project.id}
            onMouseEnter={() => handleMouseEnter(project)}
            onMouseLeave={handleMouseLeave}
            className="p-4 flex flex-col h-auto w-full bg-card hover:bg-card/90 rounded-xl bg-neutral-100 cursor-pointer shadow-sm transition-shadow duration-200"
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
              {banner ? (
                <motion.div className="absolute inset-0 w-full" style={{ height: "268.75%" }}>
                  <Image fill src={banner || "/placeholder.svg"} alt={title} className="object-cover object-top" />
                </motion.div>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </motion.div>
            <div className="mt-4 flex justify-between items-center">
              <motion.h3 layoutId={`title-${project.id}-${id}`} className="font-medium text-card-foreground text-lg">
                {title}
              </motion.h3>
              {logo && (
                <motion.div layoutId={`logo-${project.id}-${id}`} className="relative w-16 h-16 ml-4 flex-shrink-0">
                  <Image
                    src={logo || "/placeholder.svg"}
                    alt={`${title} logo`}
                    className="object-contain"
                    width={64}
                    height={64}
                  />
                </motion.div>
              )}
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
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => handleViewDetails(project)}
                className="px-4 py-2 text-sm rounded-full font-bold text-white bg-black hover:bg-gray-800 transition-colors duration-200"
              >
                View Details
              </button>
              <div className="flex gap-2">
                {urls.slice(0, 3).map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-500 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getSocialIcon(url)}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )
      })}
    </ul>
  )
}
