'use client'

import React, { useEffect, useState } from "react";
import ExpandableCardDemo from "@/components/blocks/expandable-card-demo-grid";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import DynamicCheckbox from "@/components/ui/checkbox-test";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Website {
  id: string;
  Title: string;
  Description: string;
  Status: string;
  URL: string | null;
  Tags: string[];
  Backup_Date: string | null;
  Content_Update_Date: string | null;
  archive: boolean;
  highlighted: boolean;
  Images: string | null;
  Logo: string | null;
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default function Works() {
  const [currentPage, setCurrentPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [websites, setWebsites] = useState<Website[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [active, setActive] = useState<string[]>([]);

  const websitesPerPage = 9;

  const fetchWebsites = async (page: number, search: string) => {
    const response = await fetch(`/api/fetch?page=${page}&limit=${websitesPerPage}&search=${encodeURIComponent(search)}`, {
      method: 'GET',
    });
    const data = await response.json();
    if (data.websites && Array.isArray(data.websites.data)) {
      setWebsites(data.websites.data);
      setTotal(data.websites.total);
    } else {
      console.error('Unexpected API response structure:', data);
      setWebsites([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    fetchWebsites(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const totalPages = Math.ceil(total / websitesPerPage);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const handleIsactive = (items: string[]) => {
    setActive(items)
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="bg-white min-h-screen relative pb-20">
      <div className="mx-4 md:mx-16">
        <div className="max-w-7xl pt-10 md:pt-20 lg:pt-40 pb-6 md:pb-10 px-4 w-full top-0 border-b-2 border-orange-100">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold dark:text-white">
            Here's a peek at our <span className="text-orange-400">works</span>
          </h1>
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/5 py-4 md:py-10 md:mx-5 flex flex-col">
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
          <div className="w-full md:w-4/5 flex flex-col">
            <div className="flex flex-1">
              <div className="hidden md:inline-block h-full min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10 my-4"></div>
              <ExpandableCardDemo websites={websites} filterTags={active} />
            </div>
          </div>
        </div>
        <div className="mt-8 md:absolute md:bottom-4 md:right-4 flex flex-col items-center md:items-end space-y-2">
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
            Showing <strong>{(currentPage - 1) * websitesPerPage + 1}-{Math.min(currentPage * websitesPerPage, total)}</strong> of <strong>{total}</strong> websites
          </div>
        </div>
      </div>
    </div>
  )
}

const allTags = [
  { title: "Site Type", tags: ["E-commerce", "Dynamic", "Micro"], color: "hsl(221, 83%, 53%)" },
  { title: "Industry", tags: ["Agriculture", "Healthcare", "Manufacturing", "Fashion", "Cosmetic"], color: "hsl(140, 71%, 45%)" },
  { title: "Country", tags: ["India", "Dubai", "Sri-Lanka"], color: "hsl(291, 64%, 42%)" }
]

