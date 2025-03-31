"use client"

import type React from "react"
import { useEffect, useState } from "react"
import SocialProjects from "@/components/blocks/social"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import DynamicCheckbox from "@/components/ui/checkbox-test"

interface SocialProject {
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
}

interface TagGroup {
  title: string
  tags: string[]
  color: string
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
}

// Fallback tags in case API fails
const fallbackTags = [
  {
    title: "Industry",
    tags: ["Agriculture", "Healthcare", "Manufacturing", "Fashion", "Cosmetic"],
    color: "hsl(140, 71%, 45%)",
  },
  { title: "Country", tags: ["India", "Dubai", "Sri-Lanka"], color: "hsl(291, 64%, 42%)" },
]

export default function Works() {
  const [brands, setBrands] = useState<SocialProject[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [active, setActive] = useState<string[]>([])
  const [tags, setTags] = useState<TagGroup[]>(fallbackTags)
  const [isLoadingTags, setIsLoadingTags] = useState(true)

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Scroll to top whenever active tags change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [active])

  // Fetch tags from the API for the "Social" project type
  useEffect(() => {
    const fetchTags = async () => {
      setIsLoadingTags(true)
      try {
        const response = await fetch("/api/tags?projectType=Social")
        const data = await response.json()

        if (data.tags && Array.isArray(data.tags)) {
          setTags(data.tags)
        } else {
          console.error("Unexpected API response structure:", data)
          // Keep fallback tags if API fails
        }
      } catch (error) {
        console.error("Error fetching tags:", error)
        // Keep fallback tags if API fails
      } finally {
        setIsLoadingTags(false)
      }
    }

    fetchTags()
  }, [])

  const fetchSocialProjects = async (search: string) => {
    try {
      const response = await fetch(`/api/fetch?types=social&search=${encodeURIComponent(search)}`, {
        method: "GET",
      })
      const data = await response.json()
      if (data && data.social && Array.isArray(data.social)) {
        setBrands(data.social)
      } else {
        console.error("Unexpected API response structure:", data)
        setBrands([])
      }
    } catch (error) {
      console.error("Error fetching social projects:", error)
      setBrands([])
    }
  }

  useEffect(() => {
    fetchSocialProjects(searchTerm)
  }, [searchTerm])

  const handleIsactive = (items: string[]) => {
    setActive(items)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Header - No longer sticky */}
      <div className="bg-white">
        <div className="mx-2 md:mx-8">
          <div className="max-w-7xl pt-10 md:pt-12 lg:pt-20 pb-4 md:pb-6 px-2 w-full border-b-2 border-orange-100">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold dark:text-white">
              Here's a peek at our <span className="text-orange-400">works</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable Container */}
      <div className="flex-1 flex flex-col md:flex-row mx-1 md:mx-4 lg:mx-8 relative">
        {/* Sidebar - Sticky */}
        <div className="w-full md:w-1/6 py-2 md:py-4 md:pr-3 md:sticky md:top-0 self-start h-fit">
          <LabelInputContainer>
            <Input
              id="Search"
              placeholder="Search"
              type="text"
              className="rounded"
              value={searchTerm}
              onChange={handleSearch}
            />
          </LabelInputContainer>

          {isLoadingTags ? (
            <div className="mt-4 space-y-4 animate-pulse">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-4 bg-gray-100 rounded w-3/4"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DynamicCheckbox onIsActive={handleIsactive} tags={tags} />
          )}
        </div>

        {/* Content - Scrollable */}
        <div className="w-full md:w-5/6 flex flex-col">
          <div className="flex flex-1">
            <div className="hidden md:inline-block h-full min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10 my-2"></div>
            <div className="w-full">
              <SocialProjects projects={brands} filterTags={active} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

