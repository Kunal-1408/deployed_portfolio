"use client"

import type React from "react"
import { useEffect, useState } from "react"
import BrandingProjects from "@/components/blocks/Branding"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import DynamicCheckbox from "@/components/ui/checkbox-test"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [brandings, setBrandings] = useState<Branding[]>([])
  const [highlightedCount, setHighlightedCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const brandingsPerPage = 9

  const fetchBrandings = async (page: number, search: string) => {
    try {
      const response = await fetch(
        `/api/fetch?page=${page}&limit=${brandingsPerPage}&types=branding&search=${encodeURIComponent(search)}`,
        {
          method: "GET",
        },
      )
      const data = await response.json()
      console.log("API Response:", data)
      if (data.branding && Array.isArray(data.branding.data)) {
        // Transform data to ensure compatibility
        const transformedData = data.branding.data.map((item: Branding) => {
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
        setTotal(data.branding.total || data.branding.data.length)
        setHighlightedCount(transformedData.filter((branding: Branding) => branding.highlighted).length)
      } else {
        console.error("Unexpected API response structure:", data)
        setBrandings([])
        setTotal(0)
        setHighlightedCount(0)
      }
    } catch (error) {
      console.error("Error fetching brandings:", error)
      setBrandings([])
      setTotal(0)
      setHighlightedCount(0)
    }
  }

  useEffect(() => {
    fetchBrandings(currentPage, searchTerm)
  }, [currentPage, searchTerm]) // Added searchTerm to dependencies

  const totalPages = Math.ceil((total - highlightedCount) / brandingsPerPage)
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const [active, setActive] = useState<string[]>([])

  const handleIsactive = (items: string[]) => {
    setActive(items)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  return (
    <div className="bg-white min-h-screen relative pb-20">
      <div className="mx-16 md:mx-4">
        <div className="max-w-7xl pt-20 md:pt-40 pb-10 px-4 w-full top-0 border-b-2 border-orange-100">
          <h1 className="text-xl md:text-7xl font-bold dark:text-white">
            Here's a peek at our <span className="text-orange-400">works</span>
          </h1>
        </div>
        <div className="grid grid-cols-5">
          <div className="col-span-1 py-10 mx-5 flex flex-col">
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
          <div className="col-span-4 flex flex-col">
            <div className="flex flex-1 col-span-4">
              <div className="inline-block h-full min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10 my-4"></div>
              <BrandingProjects projects={brandings} filterTags={active} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2">
          <div className="flex items-center space-x-2">
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-orange-400 text-neutral-200 hover:bg-accent hover:text-accent-foreground h-8 px-4"
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-orange-400 text-neutral-200 hover:bg-accent hover:text-accent-foreground h-8 px-4"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4 ml-2" />
            </button>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing{" "}
            <strong>
              {highlightedCount + (currentPage - 1) * brandingsPerPage + 1}-
              {Math.min(highlightedCount + currentPage * brandingsPerPage, total)}
            </strong>{" "}
            of <strong>{total}</strong> brands
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

