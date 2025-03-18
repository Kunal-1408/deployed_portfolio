"use client"

import type React from "react"
import { useEffect, useState } from "react"
import BrandingProjects from "@/components/blocks/Branding"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import DynamicCheckbox from "@/components/ui/checkbox-test"

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

interface Branding {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description: string
  clientName?: string
  logoSection: LogoSection
  bannerSection: BannerSection
  standeeSection?: StandeeSection
  cardSection?: CardSection
  goodiesSection?: GoodiesSection
  tags: string[]
  archive: boolean
  highlighted: boolean

  // Legacy fields for compatibility
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
  const [brandings, setBrandings] = useState<Branding[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [active, setActive] = useState<string[]>([])

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Scroll to top whenever active tags change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [active])

  const fetchBrandings = async (search: string) => {
    try {
      const response = await fetch(`/api/fetch?types=branding&search=${encodeURIComponent(search)}`, {
        method: "GET",
      })
      const data = await response.json()
      console.log("API Response:", data)
      if (data.branding && Array.isArray(data.branding)) {
        // Transform data to ensure compatibility
        const transformedData = data.branding.map((item: Branding) => {
          // For new branding structure
          if (item.title) {
            return {
              ...item,
              // Add legacy fields for compatibility with the UI
              Brand: item.title,
              Description: item.description,
              Logo: item.logoSection?.logo || null,
              banner: item.bannerSection?.banners?.[0] || null,
              Images: item.bannerSection?.banners?.[0] || null,
              Stats: {
                impression: "N/A",
                interactions: "N/A",
                reach: "N/A",
              },
              Tags: [],
            }
          }
          // For legacy data structure
          return item
        })

        setBrandings(transformedData)
      } else {
        console.error("Unexpected API response structure:", data)
        setBrandings([])
      }
    } catch (error) {
      console.error("Error fetching brandings:", error)
      setBrandings([])
    }
  }

  useEffect(() => {
    fetchBrandings(searchTerm)
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
            <h1 className="text-xl md:text-5xl lg:text-7xl font-bold dark:text-white">
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
          <DynamicCheckbox onIsActive={handleIsactive} tags={allTags} />
        </div>

        {/* Content - Scrollable */}
        <div className="w-full md:w-5/6 flex flex-col">
          <div className="flex flex-1">
            <div className="hidden md:inline-block h-full min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10 my-2"></div>
            <div className="w-full">
              <BrandingProjects projects={brandings} filterTags={active} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const allTags = [
  { title: "Type", tags: ["Visiting Card", "Letterhead", "Logo", "Goodies"], color: "hsl(221, 83%, 53%)" },
  // { title: "Industry", tags: ["Agriculture", "Healthcare", "Manufacturing", "Fashion", "Cosmetic"], color: "hsl(140, 71%, 45%)" },
  // { title: "Country", tags: ["India", "Dubai", "Sri-Lanka"], color: "hsl(291, 64%, 42%)" }
]

