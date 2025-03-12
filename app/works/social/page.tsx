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

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>
}

export default function Works() {
  const [brands, setBrands] = useState<SocialProject[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [active, setActive] = useState<string[]>([])

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
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="mx-4 md:mx-16">
          <div className="max-w-7xl pt-10 md:pt-16 lg:pt-36 pb-6 md:pb-10 px-4 w-full border-b-2 border-orange-100">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold dark:text-white">
              Here's a peek at our <span className="text-orange-400">works</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content - Flexible Height */}
      <div className="flex-1 flex flex-col md:flex-row mx-4 md:mx-16 relative">
        {/* Sidebar - Sticky */}
        <div className="w-full md:w-1/5 py-4 md:py-10 md:mx-5 md:sticky md:top-[200px] self-start">
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
          <DynamicCheckbox onIsActive={handleIsactive} tags={allTags} />
        </div>

        {/* Content - Scrollable */}
        <div className="w-full md:w-4/5 flex flex-col">
          <div className="flex flex-1">
            <div className="hidden md:inline-block h-full min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10 my-4"></div>
            <div className="w-full overflow-y-auto max-h-[calc(100vh-300px)] md:max-h-[calc(100vh-350px)]">
              <SocialProjects projects={brands} filterTags={active} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Sticky */}
      <div className="sticky bottom-0 bg-white py-4 border-t border-gray-100 z-10">
        <div className="mx-4 md:mx-16 flex justify-end">
          <div className="text-sm text-muted-foreground text-right">
            Showing <strong>{brands.length}</strong> social projects
          </div>
        </div>
      </div>
    </div>
  )
}

const allTags = [
  {
    title: "Industry",
    tags: ["Agriculture", "Healthcare", "Manufacturing", "Fashion", "Cosmetic"],
    color: "hsl(140, 71%, 45%)",
  },
  { title: "Country", tags: ["India", "Dubai", "Sri-Lanka"], color: "hsl(291, 64%, 42%)" },
]

