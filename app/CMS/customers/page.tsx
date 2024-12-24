'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Minus } from 'lucide-react'


interface ContentItem {
  title: string;
  description: string;
  image: File | null;
  imagePreview: string | null;
}

interface ServiceItem extends ContentItem {}

interface ServicePageContent {
  description: string;
  carouselImages: { image: File | null; imagePreview: string | null }[];
  whatWeDo: {
    description: string;
    cards: { title: string; description: string }[];
  };
  relatedProjects: { title: string; description: string; image: File | null; imagePreview: string | null }[];
}

interface Content {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  whyChooseUs: ContentItem[];
  services: ServiceItem[];
  clients: {
    logo: File | null;
    logoPreview: string | null;
  }[];
  servicePages: {
    [key: string]: ServicePageContent;
  };
}

const initialContent: Content = {
  hero: {
    title: '',
    subtitle: '',
    description: '',
  },
  whyChooseUs: [],
  services: [],
  clients: [],
  servicePages: {
    webDevelopment: {
      description: '',
      carouselImages: [],
      whatWeDo: {
        description: '',
        cards: [],
      },
      relatedProjects: [],
    },
    seo: {
      description: '',
      carouselImages: [],
      whatWeDo: {
        description: '',
        cards: [],
      },
      relatedProjects: [],
    },
    design: {
      description: '',
      carouselImages: [],
      whatWeDo: {
        description: '',
        cards: [],
      },
      relatedProjects: [],
    },
    branding: {
      description: '',
      carouselImages: [],
      whatWeDo: {
        description: '',
        cards: [],
      },
      relatedProjects: [],
    },
  },
}

export default function ContentManager() {
  const [activeMainTab, setActiveMainTab] = useState<string>('landingPage')
  const [activeLandingPageTab, setActiveLandingPageTab] = useState<string>('hero')
  const [activeServicePageTab, setActiveServicePageTab] = useState<string>('webDevelopment')
  const [content, setContent] = useState<Content>(initialContent)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/content')
      if (response.ok) {
        const data = await response.json()
        setContent(prevContent => ({
          ...prevContent,
          ...data,
          servicePages: {
            ...prevContent.servicePages,
            ...data.servicePages,
          },
        }))
      } else {
        console.error('Failed to fetch content')
      }
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHeroChange = (field: keyof Content['hero'], value: string) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }))
  }

  const handleWhyChooseUsChange = (index: number, field: keyof ContentItem, value: string | File | null) => {
    if (field === 'image' && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(prev => ({
          ...prev,
          whyChooseUs: prev.whyChooseUs.map((item, i) => 
            i === index ? { ...item, image: value, imagePreview: reader.result as string } : item
          )
        }))
      };
      reader.readAsDataURL(value);
    } else {
      setContent(prev => ({
        ...prev,
        whyChooseUs: prev.whyChooseUs.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }))
    }
  }

  const handleServicesChange = (index: number, field: keyof ServiceItem, value: string | File | null) => {
    if (field === 'image' && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(prev => ({
          ...prev,
          services: prev.services.map((service, i) => 
            i === index ? { ...service, image: value, imagePreview: reader.result as string } : service
          )
        }))
      };
      reader.readAsDataURL(value);
    } else {
      setContent(prev => ({
        ...prev,
        services: prev.services.map((service, i) => 
          i === index ? { ...service, [field]: value } : service
        )
      }))
    }
  }

  const handleClientLogoChange = (index: number, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(prev => ({
          ...prev,
          clients: prev.clients.map((client, i) => 
            i === index ? { logo: file, logoPreview: reader.result as string } : client
          )
        }))
      };
      reader.readAsDataURL(file);
    } else {
      setContent(prev => ({
        ...prev,
        clients: prev.clients.map((client, i) => 
          i === index ? { logo: null, logoPreview: null } : client
        )
      }))
    }
  }

  const handleAddClientLogo = () => {
    setContent(prev => ({
      ...prev,
      clients: [...prev.clients, { logo: null, logoPreview: null }]
    }))
  }

  const handleRemoveClientLogo = (index: number) => {
    setContent(prev => ({
      ...prev,
      clients: prev.clients.filter((_, i) => i !== index)
    }))
  }

  const handleServicePageChange = (service: string, field: keyof ServicePageContent, value: string | File | null) => {
    if (field === 'description') {
      setContent(prev => ({
        ...prev,
        servicePages: {
          ...prev.servicePages,
          [service]: { ...prev.servicePages[service], description: value as string }
        }
      }))
    }
  }

  const handleServicePageImageChange = (service: string, index: number, file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(prev => ({
          ...prev,
          servicePages: {
            ...prev.servicePages,
            [service]: {
              ...prev.servicePages[service],
              carouselImages: prev.servicePages[service].carouselImages.map((img, i) => 
                i === index ? { image: file, imagePreview: reader.result as string } : img
              )
            }
          }
        }))
      };
      reader.readAsDataURL(file);
    }
  }

  const handleAddServicePageImage = (service: string) => {
    setContent(prev => ({
      ...prev,
      servicePages: {
        ...prev.servicePages,
        [service]: {
          ...prev.servicePages[service],
          carouselImages: [...prev.servicePages[service].carouselImages, { image: null, imagePreview: null }]
        }
      }
    }))
  }

  const handleWhatWeDoChange = (service: string, field: 'description' | 'cards', value: string | { title: string; description: string }, index?: number) => {
    if (field === 'description') {
      setContent(prev => ({
        ...prev,
        servicePages: {
          ...prev.servicePages,
          [service]: {
            ...prev.servicePages[service],
            whatWeDo: {
              ...prev.servicePages[service].whatWeDo,
              description: value as string
            }
          }
        }
      }))
    } else if (field === 'cards' && typeof index === 'number' && typeof value === 'object') {
      setContent(prev => ({
        ...prev,
        servicePages: {
          ...prev.servicePages,
          [service]: {
            ...prev.servicePages[service],
            whatWeDo: {
              ...prev.servicePages[service].whatWeDo,
              cards: prev.servicePages[service].whatWeDo.cards.map((card, i) => 
                i === index ? value : card
              )
            }
          }
        }
      }))
    }
  }

  const handleAddWhatWeDoCard = (service: string) => {
    setContent(prev => ({
      ...prev,
      servicePages: {
        ...prev.servicePages,
        [service]: {
          ...prev.servicePages[service],
          whatWeDo: {
            ...prev.servicePages[service].whatWeDo,
            cards: [...prev.servicePages[service].whatWeDo.cards, { title: "New Service", description: "Description of the new service" }]
          }
        }
      }
    }))
  }

  const handleRelatedProjectChange = (service: string, index: number, field: keyof (typeof content.servicePages)[keyof typeof content.servicePages]['relatedProjects'][0], value: string | File | null) => {
    if (field === 'image' && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContent(prev => ({
          ...prev,
          servicePages: {
            ...prev.servicePages,
            [service]: {
              ...prev.servicePages[service],
              relatedProjects: prev.servicePages[service].relatedProjects.map((project, i) => 
                i === index ? { ...project, image: value, imagePreview: reader.result as string } : project
              )
            }
          }
        }))
      };
      reader.readAsDataURL(value);
    } else {
      setContent(prev => ({
        ...prev,
        servicePages: {
          ...prev.servicePages,
          [service]: {
            ...prev.servicePages[service],
            relatedProjects: prev.servicePages[service].relatedProjects.map((project, i) => 
              i === index ? { ...project, [field]: value } : project
            )
          }
        }
      }))
    }
  }

  const handleAddRelatedProject = (service: string) => {
    setContent(prev => ({
      ...prev,
      servicePages: {
        ...prev.servicePages,
        [service]: {
          ...prev.servicePages[service],
          relatedProjects: [...prev.servicePages[service].relatedProjects, { title: "New Project", description: "Description of the new project", image: null, imagePreview: null }]
        }
      }
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      })
      if (response.ok) {
        console.log('Content updated successfully')
        // Optionally, you can show a success message to the user
      } else {
        console.error('Failed to update content')
        // Optionally, you can show an error message to the user
      }
    } catch (error) {
      console.error('Error updating content:', error)
      // Optionally, you can show an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  const TabButton: React.FC<{ id: string; active: boolean; onClick: () => void; children: React.ReactNode }> = ({ id, active, onClick, children }) => (
    <button
      id={id}
      className={`px-4 py-2 font-medium text-sm rounded-md ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      onClick={onClick}
    >
      {children}
    </button>
  )

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Content Manager</h1>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex space-x-2 mb-4">
            <TabButton id="landingPage" active={activeMainTab === 'landingPage'} onClick={() => setActiveMainTab('landingPage')}>
              Landing Page
            </TabButton>
            <TabButton id="servicePages" active={activeMainTab === 'servicePages'} onClick={() => setActiveMainTab('servicePages')}>
              Service Pages
            </TabButton>
          </div>

          {activeMainTab === 'landingPage' && (
            <div>
              <div className="flex space-x-2 mb-4">
                <TabButton id="hero" active={activeLandingPageTab === 'hero'} onClick={() => setActiveLandingPageTab('hero')}>
                  Hero
                </TabButton>
                <TabButton id="whyChooseUs" active={activeLandingPageTab === 'whyChooseUs'} onClick={() => setActiveLandingPageTab('whyChooseUs')}>
                  Why Choose Us
                </TabButton>
                <TabButton id="services" active={activeLandingPageTab === 'services'} onClick={() => setActiveLandingPageTab('services')}>
                  Services
                </TabButton>
                <TabButton id="clients" active={activeLandingPageTab === 'clients'} onClick={() => setActiveLandingPageTab('clients')}>
                  Our Clients
                </TabButton>
              </div>

              {activeLandingPageTab === 'hero' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Title"
                      value={content.hero.title}
                      onChange={(e) => handleHeroChange('title', e.target.value)}
                    />
                    <Input
                      placeholder="Subtitle"
                      value={content.hero.subtitle}
                      onChange={(e) => handleHeroChange('subtitle', e.target.value)}
                    />
                    <textarea
                      placeholder="Description"
                      value={content.hero.description}
                      onChange={(e) => handleHeroChange('description', 
                      e.target.value)}
                      rows={3}
                      className='flex min-h-[80px] w-full rounded-md border border-input bg-slate-50 dark:bg-zinc-500 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                    />
                  </CardContent>
                </Card>
              )}

              {activeLandingPageTab === 'whyChooseUs' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Why Choose Us</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {content.whyChooseUs.map((item, index) => (
                      <div key={index} className="mb-4 p-4 border rounded">
                        <Input
                          placeholder="Title"
                          value={item.title}
                          onChange={(e) => handleWhyChooseUsChange(index, 'title', e.target.value)}
                          className="mb-2"
                        />
                        <textarea
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleWhyChooseUsChange(index, 'description', e.target.value)}
                          rows={3}
                          className="mb-2 flex min-h-[80px] w-full rounded-md border border-input bg-slate-50 dark:bg-zinc-500 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <div className="flex items-center space-x-4">
                          <Input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files ? e.target.files[0] : null;
                              if (file) handleWhyChooseUsChange(index, 'image', file);
                            }}
                            accept="image/*"
                          />
                          {item.imagePreview && (
                            <img src={item.imagePreview} alt={`Preview of ${item.title}`} className="w-24 h-24 object-cover" />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {activeLandingPageTab === 'services' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {content.services.map((service, index) => (
                      <div key={index} className="mb-4 p-4 border rounded">
                        <Input
                          placeholder="Service Title"
                          value={service.title}
                          onChange={(e) => handleServicesChange(index, 'title', e.target.value)}
                          className="mb-2"
                        />
                        <textarea
                          placeholder="Service Description"
                          value={service.description}
                          onChange={(e) => handleServicesChange(index, 'description', e.target.value)}
                          rows={3}
                          className="mb-2 flex min-h-[80px] w-full rounded-md border border-input bg-slate-50 dark:bg-zinc-500 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <div className="flex items-center space-x-4">
                          <Input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files ? e.target.files[0] : null;
                              if (file) handleServicesChange(index, 'image', file);
                            }}
                            accept="image/*"
                          />
                          {service.imagePreview && (
                            <img src={service.imagePreview} alt={`Preview of ${service.title}`} className="w-24 h-24 object-cover" />
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {activeLandingPageTab === 'clients' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Our Clients</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {content.clients.map((client, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <Input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files ? e.target.files[0] : null;
                              handleClientLogoChange(index, file);
                            }}
                            accept="image/*"
                            className="mb-2"
                          />
                          {client.logoPreview && (
                            <img src={client.logoPreview} alt={`Client logo ${index + 1}`} className="w-24 h-24 object-contain mb-2" />
                          )}
                          <button type="button" onClick={() => handleRemoveClientLogo(index)} >
                            <Minus className="w-4 h-4 bg-destructive text-destructive-foreground hover:bg-destructive/90" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={handleAddClientLogo} className="mt-4">
                      <PlusCircle className="w-4 h-4 mr-2" /> Add Client Logo
                    </button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeMainTab === 'servicePages' && (
            <div>
              <div className="flex space-x-2 mb-4">
                <TabButton id="webDevelopment" active={activeServicePageTab === 'webDevelopment'} onClick={() => setActiveServicePageTab('webDevelopment')}>
                  Web Development
                </TabButton>
                <TabButton id="seo" active={activeServicePageTab === 'seo'} onClick={() => setActiveServicePageTab('seo')}>
                  SEO
                </TabButton>
                <TabButton id="design" active={activeServicePageTab === 'design'} onClick={() => setActiveServicePageTab('design')}>
                  Design
                </TabButton>
                <TabButton id="branding" active={activeServicePageTab === 'branding'} onClick={() => setActiveServicePageTab('branding')}>
                  Branding
                </TabButton>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{activeServicePageTab.charAt(0).toUpperCase() + activeServicePageTab.slice(1)} Service Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    placeholder="Description"
                    value={content.servicePages[activeServicePageTab].description}
                    onChange={(e) => handleServicePageChange(activeServicePageTab, 'description', e.target.value)}
                    rows={3}
                    className='flex min-h-[80px] w-full rounded-md border border-input bg-slate-50 dark:bg-zinc-500 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Image Carousel</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {content.servicePages[activeServicePageTab].carouselImages.map((img, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <Input
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files ? e.target.files[0] : null;
                              if (file) handleServicePageImageChange(activeServicePageTab, index, file);
                            }}
                            accept="image/*"
                            className="mb-2"
                          />
                          {img.imagePreview && (
                            <img src={img.imagePreview} alt={`Carousel image ${index + 1}`} className="w-24 h-24 object-cover" />
                          )}
                        </div>
                      ))}
                    </div>
                    <button type="button" onClick={() => handleAddServicePageImage(activeServicePageTab)} className="mt-2">
                      <PlusCircle className="w-4 h-4 mr-2" /> Add Image
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">What We Do</h3>
                    <textarea
                      placeholder="Section Description"
                      value={content.servicePages[activeServicePageTab].whatWeDo.description}
                      onChange={(e) => handleWhatWeDoChange(activeServicePageTab, 'description', e.target.value)}
                      rows={3}
                      className="mb-2 flex min-h-[80px] w-full rounded-md border border-input bg-slate-50 dark:bg-zinc-500 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {content.servicePages[activeServicePageTab].whatWeDo.cards.map((card, index) => (
                      <div key={index} className="mb-2 p-2 border rounded">
                        <Input
                          placeholder="Card Title"
                          value={card.title}
                          onChange={(e) => handleWhatWeDoChange(activeServicePageTab, 'cards', { ...card, title: e.target.value }, index)}
                          className="mb-2"
                        />
                        <textarea
                          placeholder="Card Description"
                          value={card.description}
                          onChange={(e) => handleWhatWeDoChange(activeServicePageTab, 'cards', { ...card, description: e.target.value }, index)}
                          rows={2}
                          className='flex min-h-[80px] w-full rounded-md border border-input bg-slate-50 dark:bg-zinc-500 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                        />
                      </div>
                    ))}
                    <button type="button" onClick={() => handleAddWhatWeDoCard(activeServicePageTab)} className="mt-2">
                      <PlusCircle className="w-4 h-4 mr-2" /> Add Card
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <button type="submit" className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}