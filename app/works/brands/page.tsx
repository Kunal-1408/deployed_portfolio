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
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="mx-4 md:mx-16">
          <div className="max-w-7xl pt-10 md:pt-16 lg:pt-36 pb-6 md:pb-10 px-4 w-full border-b-2 border-orange-100">
            <h1 className="text-xl md:text-5xl lg:text-7xl font-bold dark:text-white">
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
              <BrandingProjects projects={brandings} filterTags={active} />
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Sticky */}
      <div className="sticky bottom-0 bg-white py-4 border-t border-gray-100 z-10">
        <div className="mx-4 md:mx-16 flex justify-end">
          <div className="text-sm text-muted-foreground text-right">
            Showing <strong>{brandings.length}</strong> brands
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

