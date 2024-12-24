'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowUpDown, ChevronLeft, ChevronRight, File, MoreHorizontal, PlusCircle, Search, Star, X } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Brand {
  id: string
  Brand: string
  Description: string
  Logo: string
  Stats: BrandStats[]
  banner: string
  highlighted: boolean
  tags: string[]
}

interface BrandStats {
  impression?: string
  interactions?: string
  reach?: string
}

interface Notification {
  id: number
  message: string
  type: 'success' | 'error'
}

export default function BrandDashboard() {
  const [activeTagManager, setActiveTagManager] = useState<string | null>(null)
  const [editingBrand, setEditingBrand] = useState<string | null>(null)
  const [editedBrand, setEditedBrand] = useState<Brand | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [brands, setBrands] = useState<Brand[]>([])
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [highlightedCount, setHighlightedCount] = useState(0)
  const [isAddingBrand, setIsAddingBrand] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const brandsPerPage = 10

  const allTags: string[] = ["Luxury", "Eco-friendly", "Tech", "Fashion", "Food", "Automotive"]

  const [newBrand, setNewBrand] = useState<Brand>({
    id: '',
    Brand: '',
    Description: '',
    Logo: '',
    Stats: [],
    banner: '',
    highlighted: false,
    tags: []
  })

  useEffect(() => {
    fetchBrands()
  }, [currentPage, searchQuery])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setEditingBrand(null)
        setEditedBrand(null)
        setIsAddingBrand(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleHighlight = async (brandId: string) => {
    const brandToUpdate = brands.find(b => b.id === brandId)
    if (brandToUpdate) {
      try {
        const updatedBrands = brands.map(brand =>
          brand.id === brandId ? { ...brand, highlighted: !brand.highlighted } : brand
        )
        setBrands(updatedBrands)
        setFilteredBrands(updatedBrands)

        const response = await fetch('/api/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: brandId,
            highlighted: !brandToUpdate.highlighted,
            type: 'brands'
          }),
        });

        const updatedBrand = await response.json();
        
        if (updatedBrand) {
          addNotification(`The brand has been ${updatedBrand.highlighted ? 'highlighted' : 'unhighlighted'} successfully.`, "success")
        } else {
          setBrands(brands)
          setFilteredBrands(filteredBrands)
          throw new Error('Failed to update highlight status')
        }
      } catch (error) {
        console.error('Error updating highlight status:', error)
        addNotification("There was an error updating the brand. Please try again.", "error")
      }
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch(`/api/fetch?page=${currentPage}&limit=${brandsPerPage}&search=${encodeURIComponent(searchQuery)}&type=brands`, {
        method: 'GET',
      })
      const data = await response.json()
      
      if (Array.isArray(data.items)) {
        setBrands(data.items)
        setFilteredBrands(data.items)
        setTotal(data.total)
        setHighlightedCount(data.highlightedCount)
      } else {
        console.error('Unexpected data structure:', data)
        addNotification("Unexpected data structure received", "error")
      }
    } catch (error) {
      console.error('Error fetching brands:', error)
      addNotification("Failed to fetch brands", "error")
    }
  }

  const totalPages = Math.ceil(total / brandsPerPage)

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const toggleTagManager = () => {
    setActiveTagManager(activeTagManager ? null : editingBrand || 'new')
  }

  const addTag = (newTag: string) => {
    if (editedBrand) {
      setEditedBrand({
        ...editedBrand,
        tags: [...new Set([...editedBrand.tags, newTag])]
      })
    } else if (isAddingBrand) {
      setNewBrand({
        ...newBrand,
        tags: [...new Set([...newBrand.tags, newTag])]
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (editedBrand) {
      setEditedBrand({
        ...editedBrand,
        tags: editedBrand.tags.filter(tag => tag !== tagToRemove)
      })
    } else if (isAddingBrand) {
      setNewBrand({
        ...newBrand,
        tags: newBrand.tags.filter(tag => tag !== tagToRemove)
      })
    }
  }

  const toggleEdit = (brand: Brand) => {
    if (editingBrand === brand.id) {
      setEditingBrand(null)
      setEditedBrand(null)
      setActiveTagManager(null)
    } else {
      setEditingBrand(brand.id)
      setEditedBrand(brand)
    }
  }

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, 5000)
  }

  const updateBrand = async () => {
    if (editedBrand) {
      try {
        const response = await fetch('/api/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...editedBrand, type: 'brands' }),
        });

        const updatedBrand = await response.json();
        
        if (updatedBrand) {
          setBrands(prevBrands => 
            prevBrands.map(b => b.id === updatedBrand.id ? updatedBrand : b)
          )
          setFilteredBrands(prevFiltered => 
            prevFiltered.map(b => b.id === updatedBrand.id ? updatedBrand : b)
          )
          setEditingBrand(null)
          setEditedBrand(null)
          setActiveTagManager(null)
          addNotification("The brand has been successfully updated.", "success")
        } else {
          throw new Error('Failed to update brand')
        }
      } catch (error) {
        console.error('Error updating brand:', error)
        addNotification("There was an error updating the brand. Please try again.", "error")
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Brand) => {
    if (editedBrand) {
      setEditedBrand({
        ...editedBrand,
        [field]: e.target.value
      })
    } else if (isAddingBrand) {
      setNewBrand({
        ...newBrand,
        [field]: e.target.value
      })
    }
  }

  const addBrand = async () => {
    try {
      const response = await fetch('/api/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newBrand, type: 'brands' }),
      });

      const addedBrand = await response.json();
      
      if (addedBrand) {
        setBrands(prevBrands => [...prevBrands, addedBrand])
        setFilteredBrands(prevFiltered => [...prevFiltered, addedBrand])
        setTotal(prevTotal => prevTotal + 1)
        setIsAddingBrand(false)
        setNewBrand({
          id: '',
          Brand: '',
          Description: '',
          Logo: '',
          Stats: [],
          banner: '',
          highlighted: false,
          tags: []
        })
        addNotification("The brand has been successfully added.", "success")
      } else {
        throw new Error('Failed to add brand')
      }
    } catch (error) {
      console.error('Error adding brand:', error)
      addNotification("There was an error adding the brand. Please try again.", "error")
    }
  }

  const exportBrands = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Brand,Description,Logo,Banner,Tags,Highlighted\n"
      + filteredBrands.map(brand => 
          `${brand.id},"${brand.Brand}","${brand.Description}",${brand.Logo},${brand.banner},"${brand.tags.join(', ')}",${brand.highlighted}`
        ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "brands_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const executeSearch = () => {
    setIsSearching(true)
    const lowercasedQuery = searchQuery.toLowerCase()
    const filtered = brands.filter(brand => 
      (brand.Brand?.toLowerCase().includes(lowercasedQuery) ?? false) ||
      (brand.Description?.toLowerCase().includes(lowercasedQuery) ?? false) ||
      (brand.tags?.some(tag => tag.toLowerCase().includes(lowercasedQuery)) ?? false)
    )
    setFilteredBrands(filtered)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
    setFilteredBrands(brands)
    setCurrentPage(1)
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="flex items-center">
            <div className="relative w-full max-w-sm">
              <Input
                type="search"
                placeholder="Search brands..."
                className="w-full pr-20"
                value={searchQuery}
                onChange={handleSearch}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button 
                  className="h-full px-2 text-gray-400 hover:text-gray-600" 
                  onClick={executeSearch}
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
                {isSearching && (
                  <button
                    onClick={clearSearch}
                    className="h-full px-2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={exportBrands}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-neutral-300 hover:bg-accent hover:text-accent-foreground h-8 px-3 gap-1"
              >
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </button>
              <button 
                onClick={() => setIsAddingBrand(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Brand
                </span>
              </button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Brands</CardTitle>
              <CardDescription>
                Manage your brands and view their status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">
                      <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 p-0">
                        Brand
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Logo</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBrands.length > 0 ? (
                    filteredBrands.map((brand) => (
                      <TableRow key={brand.id}>
                        <TableCell className="font-medium">{brand.Brand}</TableCell>
                        <TableCell className="max-w-md">
                          <div className="line-clamp-3 overflow-hidden text-ellipsis">
                            {brand.Description}
                          </div>
                        </TableCell>
                        <TableCell>
                          {brand.Logo && (
                            <Image src={brand.Logo} alt={`${brand.Brand} logo`} width={50} height={50} />
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {brand.tags.map((tag, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {brand.Stats.map((stat, index) => (
                            <div key={index}>
                              {stat.impression && <span>Impressions: {stat.impression}</span>}
                              {stat.interactions && <span>Interactions: {stat.interactions}</span>}
                              {stat.reach && <span>Reach: {stat.reach}</span>}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                                aria-haspopup="true"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => toggleEdit(brand)} className="items-center">
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => toggleHighlight(brand.id)}
                            className={`p-1 rounded-full ${
                              brand.highlighted ? 'text-yellow-500' : 'text-gray-300'
                            } hover:text-yellow-500 transition-colors`}
                          >
                            <Star className="h-5 w-5" fill={brand.highlighted ? 'currentColor' : 'none'} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No brands found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredBrands.length > 0 ? (currentPage - 1) * brandsPerPage + 1 : 0}-{Math.min(currentPage * brandsPerPage, filteredBrands.length)}</strong> of <strong>{filteredBrands.length}</strong> brands
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-black text-neutral-200 hover:bg-accent hover:text-accent-foreground h-8 px-4"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-black text-neutral-200 hover:bg-accent hover:text-accent-foreground h-8 px-4"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
      {(editingBrand && editedBrand) || isAddingBrand ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={popoverRef} className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{isAddingBrand ? "Add Brand" : "Edit Brand"}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="brand" className="block text-md font-semibold text-gray-700">Brand Name</label>
                <Input
                  id="brand"
                  value={isAddingBrand ? newBrand.Brand : editedBrand?.Brand ?? ''}
                  onChange={(e) => handleInputChange(e, 'Brand')}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-md font-semibold text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={isAddingBrand ? newBrand.Description : editedBrand?.Description ?? ''}
                  onChange={(e) => handleInputChange(e, 'Description')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="logo" className="block text-md font-semibold text-gray-700">Logo URL</label>
                <Input
                  id="logo"
                  value={isAddingBrand ? newBrand.Logo : editedBrand?.Logo ?? ''}
                  onChange={(e) => handleInputChange(e, 'Logo')}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="banner" className="block text-md font-semibold text-gray-700">Banner URL</label>
                <Input
                  id="banner"
                  value={isAddingBrand ? newBrand.banner : editedBrand?.banner ?? ''}
                  onChange={(e) => handleInputChange(e, 'banner')}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="tags" className="block text-md font-semibold text-gray-700">Tags</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {allTags.map((tag, index) => (
                    <span
                      key={index}
                      className={`cursor-pointer inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        (isAddingBrand ? newBrand.tags : editedBrand?.tags ?? []).includes(tag)
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                      onClick={() =>
                        (isAddingBrand ? newBrand.tags : editedBrand?.tags ?? []).includes(tag)
                          ? removeTag(tag)
                          : addTag(tag)
                      }
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditingBrand(null)
                  setEditedBrand(null)
                  setIsAddingBrand(false)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={isAddingBrand ? addBrand : updateBrand}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isAddingBrand ? "Add" : "Save"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="fixed bottom-4 right-4 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`mb-2 p-4 rounded-md ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  )
}