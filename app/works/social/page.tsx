"use client"

import type React from "react"
import { useEffect, useState } from "react"
import SocialProjects from "@/components/blocks/social"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import DynamicCheckbox from "@/components/ui/checkbox-test"
import { ChevronLeft, ChevronRight } from "lucide-react"

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
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [brands, setBrands] = useState<SocialProject[]>([])
  const [highlightedCount, setHighlightedCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")

  const websitesPerPage = 9

  const fetchWebsites = async (page: number, search: string) => {
    try {
      const response = await fetch(
        `/api/fetch?page=${page}&limit=${websitesPerPage}&types=social&search=${encodeURIComponent(search)}`,
        {
          method: "GET",
        },
      )
      const data = await response.json()
      if (data && data.social && data.social.data) {
        setBrands(data.social.data)
        setTotal(data.social.total || 0)
        setHighlightedCount(data.social.data.filter((project: SocialProject) => project.highlighted).length)
      } else {
        console.error("Unexpected API response structure:", data)
      }
    } catch (error) {
      console.error("Error fetching websites:", error)
    }
  }

  useEffect(() => {
    fetchWebsites(currentPage, searchTerm)
  }, [currentPage, searchTerm])

  const totalPages = Math.ceil((total - highlightedCount) / websitesPerPage)
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const [active, Isactive] = useState<string[]>([])

  const handleIsactive = (items: string[]) => {
    Isactive(items)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1) // Reset to first page when searching
  }

  return (
    <div className="bg-white min-h-screen relative pb-20">
      <div className="mx-4 sm:mx-8 md:mx-16">
        <div className="max-w-7xl pt-10 sm:pt-20 md:pt-40 pb-6 sm:pb-10 px-4 w-full top-0 border-b-2 border-orange-100">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold dark:text-white">
            Here's a peek at our <span className="text-orange-400">works</span>
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="md:col-span-1 py-4 sm:py-6 md:py-10 flex flex-col space-y-4">
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
          <div className="md:col-span-4 flex flex-col">
            <div className="flex flex-1">
              <div className="hidden md:inline-block h-full min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10 my-4 mr-4"></div>
              <SocialProjects projects={brands} filterTags={active} />
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center md:items-end space-y-2">
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
          <div className="text-sm text-muted-foreground text-center md:text-right">
            Showing{" "}
            <strong>
              {highlightedCount + (currentPage - 1) * websitesPerPage + 1}-
              {Math.min(highlightedCount + currentPage * websitesPerPage, total)}
            </strong>{" "}
            of <strong>{total}</strong> websites
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

