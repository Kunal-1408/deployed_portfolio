'use client'

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
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

interface SocialProject {
  id: string
  Brand: string
  Description: string
  Logo: string
  Stats: SocialStats
  banner: string
  highlighted: boolean
  tags: string[]
}

interface SocialStats {
  impression?: string
  interactions?: string
  reach?: string
}

interface TagGroup {
  title: string
  tags: string[]
  color: string
}

interface Notification {
  id: number
  message: string
  type: 'success' | 'error'
}

export default function SocialDashboard() {
  const [activeTagManager, setActiveTagManager] = useState<string | null>(null)
  const [editingProject, setEditingProject] = useState<string | null>(null)
  const [editedProject, setEditedProject] = useState<SocialProject | null>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [projects, setProjects] = useState<SocialProject[]>([])
  const [filteredProjects, setFilteredProjects] = useState<SocialProject[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [highlightedCount, setHighlightedCount] = useState(0)
  const [isAddingProject, setIsAddingProject] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const projectsPerPage = 10

  const allTags: TagGroup[] = [
    {title:"Platform", tags:["Instagram", "Facebook", "Twitter", "LinkedIn"], color: "hsl(221, 83%, 53%)"},
    {title:"Campaign Type", tags:["Awareness", "Engagement", "Conversion"], color: "hsl(140, 71%, 45%)"},
    {title:"Content Type", tags:["Image", "Video", "Carousel", "Story"], color: "hsl(291, 64%, 42%)"}
  ]

  const [newProject, setNewProject] = useState<SocialProject>({
    id: '',
    Brand: '',
    Description: '',
    Logo: '',
    Stats: {},
    banner: '',
    highlighted: false,
    tags: []
  })

  useEffect(() => {
    fetchProjects()
  }, [currentPage])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setEditingProject(null)
        setEditedProject(null)
        setIsAddingProject(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleHighlight = async (projectId: string) => {
    const projectToUpdate = projects.find(p => p.id === projectId)
    if (projectToUpdate) {
      try {
        const updatedProjects = projects.map(project =>
          project.id === projectId ? { ...project, highlighted: !project.highlighted } : project
        )
        setProjects(updatedProjects)
        setFilteredProjects(updatedProjects)

        const response = await fetch('/api/social/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: projectId,
            highlighted: !projectToUpdate.highlighted,
          }),
        });

        const updatedProject = await response.json();
        
        if (updatedProject) {
          addNotification(`The project has been ${updatedProject.highlighted ? 'highlighted' : 'unhighlighted'} successfully.`, "success")
        } else {
          setProjects(projects)
          setFilteredProjects(filteredProjects)
          throw new Error('Failed to update highlight status')
        }
      } catch (error) {
        console.error('Error updating highlight status:', error)
        addNotification("There was an error updating the project. Please try again.", "error")
      }
    }
  }

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/social/fetch?page=${currentPage}&limit=${projectsPerPage}&search=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
      })
      const data = await response.json()
      
      if (Array.isArray(data.projects)) {
        setProjects(data.projects)
        setFilteredProjects(data.projects)
        setTotal(data.total)
        setHighlightedCount(data.highlightedCount)
      } else {
        console.error('Unexpected data structure:', data)
        addNotification("Unexpected data structure received", "error")
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      addNotification("Failed to fetch projects", "error")
    }
  }

  const totalPages = Math.ceil(total / projectsPerPage)

  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))

  const toggleTagManager = () => {
    setActiveTagManager(activeTagManager ? null : editingProject || 'new')
  }

  const addTag = (newTag: string) => {
    if (editedProject) {
      setEditedProject({
        ...editedProject,
        tags: [...new Set([...editedProject.tags, newTag])]
      })
    } else if (isAddingProject) {
      setNewProject({
        ...newProject,
        tags: [...new Set([...newProject.tags, newTag])]
      })
    }
  }

  const removeTag = (tagToRemove: string) => {
    if (editedProject) {
      setEditedProject({
        ...editedProject,
        tags: editedProject.tags.filter(tag => tag !== tagToRemove)
      })
    } else if (isAddingProject) {
      setNewProject({
        ...newProject,
        tags: newProject.tags.filter(tag => tag !== tagToRemove)
      })
    }
  }

  const toggleEdit = (project: SocialProject) => {
    if (editingProject === project.id) {
      setEditingProject(null)
      setEditedProject(null)
      setActiveTagManager(null)
    } else {
      setEditingProject(project.id)
      setEditedProject(project)
    }
  }

  const addNotification = (message: string, type: 'success' | 'error') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id))
    }, 5000)
  }

  const updateProject = async () => {
    if (editedProject) {
      try {
        const response = await fetch('/api/social/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedProject),
        });

        const updatedProject = await response.json();
        
        if (updatedProject) {
          setProjects(prevProjects => 
            prevProjects.map(p => p.id === updatedProject.id ? updatedProject : p)
          )
          setFilteredProjects(prevFiltered => 
            prevFiltered.map(p => p.id === updatedProject.id ? updatedProject : p)
          )
          setEditingProject(null)
          setEditedProject(null)
          setActiveTagManager(null)
          addNotification("The project has been successfully updated.", "success")
        } else {
          throw new Error('Failed to update project')
        }
      } catch (error) {
        console.error('Error updating project:', error)
        addNotification("There was an error updating the project. Please try again.", "error")
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof SocialProject) => {
    if (editedProject) {
      setEditedProject({
        ...editedProject,
        [field]: e.target.value
      })
    } else if (isAddingProject) {
      setNewProject({
        ...newProject,
        [field]: e.target.value
      })
    }
  }

  const addProject = async () => {
    try {
      const response = await fetch('/api/social/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      const addedProject = await response.json();
      
      if (addedProject) {
        setProjects(prevProjects => [...prevProjects, addedProject])
        setFilteredProjects(prevFiltered => [...prevFiltered, addedProject])
        setTotal(prevTotal => prevTotal + 1)
        setIsAddingProject(false)
        setNewProject({
          id: '',
          Brand: '',
          Description: '',
          Logo: '',
          Stats: {},
          banner: '',
          highlighted: false,
          tags: []
        })
        addNotification("The project has been successfully added.", "success")
      } else {
        throw new Error('Failed to add project')
      }
    } catch (error) {
      console.error('Error adding project:', error)
      addNotification("There was an error adding the project. Please try again.", "error")
    }
  }

  const exportProjects = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "ID,Brand,Description,Logo,Banner,Tags,Highlighted,Impressions,Interactions,Reach\n"
      + filteredProjects.map(project => 
          `${project.id},"${project.Brand}","${project.Description}",${project.Logo},${project.banner},"${project.tags.join(', ')}",${project.highlighted},${project.Stats.impression || ''},${project.Stats.interactions || ''},${project.Stats.reach || ''}`
        ).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "social_projects_export.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getTagColor = (tag: string) => {
    const tagGroup = allTags.find(group => group.tags.includes(tag));
    return tagGroup ? tagGroup.color : 'hsl(0, 0%, 50%)';
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const executeSearch = () => {
    setIsSearching(true)
    const lowercasedQuery = searchQuery.toLowerCase()
    const filtered = projects.filter(project => 
      (project.Brand?.toLowerCase().includes(lowercasedQuery) ?? false) ||
      (project.Description?.toLowerCase().includes(lowercasedQuery) ?? false) ||
      (project.tags?.some(tag => tag.toLowerCase().includes(lowercasedQuery)) ?? false)
    )
    setFilteredProjects(filtered)
    setCurrentPage(1)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearching(false)
    setFilteredProjects(projects)
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
                placeholder="Search social projects..."
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
                onClick={exportProjects}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-neutral-300 hover:bg-accent hover:text-accent-foreground h-8 px-3 gap-1"
              >
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Export
                </span>
              </button>
              <button 
                onClick={() => setIsAddingProject(true)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3 gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Add Project
                </span>
              </button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Social Projects</CardTitle>
              <CardDescription>
                Manage your social media projects and view their status.
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
                    <TableHead>Banner</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Stats</TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.Brand}</TableCell>
                        <TableCell className="max-w-md">
                          <div className="line-clamp-3 overflow-hidden text-ellipsis">
                            {project.Description}
                          </div>
                        </TableCell>
                        <TableCell>
                          <img src={project.Logo} alt={`${project.Brand} logo`} className="w-10 h-10 object-contain" />
                        </TableCell>
                        <TableCell>
                          <img src={project.banner} alt={`${project.Brand} banner`} className="w-20 h-10 object-cover" />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag, index) => (
                              <span 
                                key={index} 
                                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" 
                                style={{
                                  backgroundColor: `color-mix(in srgb, ${getTagColor(tag)} 25%, white)`,
                                  color: getTagColor(tag),
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>Impressions: {project.Stats.impression || 'N/A'}</p>
                            <p>Interactions: {project.Stats.interactions || 'N/A'}</p>
                            <p>Reach: {project.Stats.reach || 'N/A'}</p>
                          </div>
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
                              <DropdownMenuItem onClick={() => toggleEdit(project)} className="items-center">
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                        <TableCell>
                          <button
                            onClick={() => toggleHighlight(project.id)}
                            className={`p-1 rounded-full ${
                              project.highlighted ? 'text-yellow-500' : 'text-gray-300'
                            } hover:text-yellow-500 transition-colors`}
                          >
                            <Star className="h-5 w-5" fill={project.highlighted ? 'currentColor' : 'none'} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No social projects found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredProjects.length > 0 ? (currentPage - 1) * projectsPerPage + 1 : 0}-{Math.min(currentPage * projectsPerPage, filteredProjects.length)}</strong> of <strong>{filteredProjects.length}</strong> projects
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
      {(editingProject && editedProject) || isAddingProject ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={popoverRef} className="bg-white rounded-lg p-6 w-[800px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{isAddingProject ? "Add Social Project" : "Edit Social Project"}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="brand" className="block text-md font-semibold text-gray-700">Brand Name</label>
                <Input
                  id="brand"
                  value={isAddingProject ? newProject.Brand : editedProject?.Brand ?? ''}
                  onChange={(e) => handleInputChange(e, 'Brand')}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-md font-semibold text-gray-700">Description</label>
                <textarea
                  id="description"
                  value={isAddingProject ? newProject.Description : editedProject?.Description ?? ''}
                  onChange={(e) => handleInputChange(e, 'Description')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="logo" className="block text-md font-semibold text-gray-700">Logo URL</label>
                <Input
                  id="logo"
                  value={isAddingProject ? newProject.Logo : editedProject?.Logo ?? ''}
                  onChange={(e) => handleInputChange(e, 'Logo')}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="banner" className="block text-md font-semibold text-gray-700">Banner URL</label>
                <Input
                  id="banner"
                  value={isAddingProject ? newProject.banner : editedProject?.banner ?? ''}
                  onChange={(e) => handleInputChange(e, 'banner')}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="tags" className="block text-md font-semibold text-gray-700">Tags</label>
                <div className="mt-1 flex flex-wrap gap-2 cursor-pointer" onClick={toggleTagManager}>
                  {(isAddingProject ? newProject.tags : editedProject?.tags ?? []).map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" 
                      style={{
                        backgroundColor: `color-mix(in srgb, ${getTagColor(tag)} 25%, white)`,
                        color: getTagColor(tag),
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {activeTagManager === editingProject && (
                  <div className="mt-2 p-2 ">
                    <div className="flex flex-col space-y-4">
                      {allTags.map((tagGroup, index) => (
                        <div key={index} className="pb-2 flex flex-col border border-dashed border-gray-200 rounded-md"> 
                          <h5 className={`text-${tagGroup.color}-600 text-md font-semibold mb-2`}>
                            {tagGroup.title}
                          </h5>
                          <div className="flex flex-wrap gap-2 "> 
                            {tagGroup.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="cursor-pointer h-6 max-w-full flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border hover:shadow-[3px_3px_0px_0px_rgba(0,0,0)] transition duration-200"
                                style={{
                                  backgroundColor: (isAddingProject ? newProject.tags : editedProject?.tags ?? []).includes(tag)
                                    ? `color-mix(in srgb, ${tagGroup.color} 25%, white)`
                                    : 'white',
                                  color: tagGroup.color,
                                  borderColor: tagGroup.color,
                                }}
                                onClick={() =>
                                  (isAddingProject ? newProject.tags : editedProject?.tags ?? []).includes(tag) ? removeTag(tag) : addTag(tag)
                                }
                              >
                                {tag}
                                {(isAddingProject ? newProject.tags : editedProject?.tags ?? []).includes(tag) && (
                                  <X
                                    className="ml-1 h-3 w-3"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeTag(tag);
                                    }}
                                  />
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditingProject(null)
                  setEditedProject(null)
                  setActiveTagManager(null)
                  setIsAddingProject(false)
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={isAddingProject ? addProject : updateProject}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isAddingProject ? "Add" : "Save"}
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