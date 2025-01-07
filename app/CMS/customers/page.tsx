'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Minus } from 'lucide-react'

interface ContentItem {
  title: string;
  description: string;
  imageUrl: string;
}

interface ServiceItem extends ContentItem {
  src: string;
}

interface CarouselImage {
  imageUrl: string;
}

interface WhatWeDoCard {
  title: string;
  description: string;
}

interface ServicePageContent {
  description: string;
  carouselImages: CarouselImage[];
  whatWeDo: {
    description: string;
    cards: WhatWeDoCard[];
  };
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
    logoUrl: string;
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
    },
    seo: {
      description: '',
      carouselImages: [],
      whatWeDo: {
        description: '',
        cards: [],
      },
    },
    design: {
      description: '',
      carouselImages: [],
      whatWeDo: {
        description: '',
        cards: [],
      },
    },
    branding: {
      description: '',
      carouselImages: [],
      whatWeDo: {
        description: '',
        cards: [],
      },
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
    setIsLoading(true);
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        setContent(prevContent => ({
          ...prevContent,
          ...data,
          servicePages: {
            ...prevContent.servicePages,
            ...Object.fromEntries(
              Object.entries(data.servicePages || {}).map(([key, value]) => [
                key,
                {
                  ...prevContent.servicePages[key],
                  ...value,
                  carouselImages: (value as any).carouselImages || [],
                  whatWeDo: {
                    ...(prevContent.servicePages[key]?.whatWeDo || {}),
                    ...((value as any).whatWeDo || {}),
                    cards: ((value as any).whatWeDo?.cards || []).map((card: any) => ({
                      title: card.title || '',
                      description: card.description || ''
                    }))
                  }
                }
              ])
            )
          },
        }));
      } else {
        console.error('Failed to fetch content');
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeroChange = (field: keyof Content['hero'], value: string) => {
    setContent(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }))
  }

  const handleWhyChooseUsChange = (index: number, field: keyof ContentItem, value: string | File) => {
    setContent(prev => ({
      ...prev,
      whyChooseUs: prev.whyChooseUs.map((item, i) => 
        i === index ? { ...item, [field]: value instanceof File ? URL.createObjectURL(value) : value } : item
      )
    }))
  }

  const handleServicesChange = (index: number, field: keyof ServiceItem, value: string | File) => {
    setContent(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value instanceof File ? URL.createObjectURL(value) : value } : service
      )
    }))
  }

  const handleClientLogoChange = (index: number, file: File) => {
    setContent(prev => ({
      ...prev,
      clients: prev.clients.map((client, i) => 
        i === index ? { ...client, logoUrl: URL.createObjectURL(file) } : client
      )
    }))
  }

  const handleAddClientLogo = () => {
    setContent(prev => ({
      ...prev,
      clients: [...prev.clients, { logoUrl: '' }]
    }))
  }

  const handleRemoveClientLogo = (index: number) => {
    setContent(prev => ({
      ...prev,
      clients: prev.clients.filter((_, i) => i !== index)
    }))
  }

  const handleServicePageChange = (service: string, field: keyof ServicePageContent, value: string | File) => {
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

  const handleServicePageImageChange = (service: string, index: number, file: File) => {
    setContent(prev => ({
      ...prev,
      servicePages: {
        ...prev.servicePages,
        [service]: {
          ...prev.servicePages[service],
          carouselImages: prev.servicePages[service].carouselImages.map((img, i) => 
            i === index ? { ...img, imageUrl: URL.createObjectURL(file) } : img
          )
        }
      }
    }))
  }

  const handleAddServicePageImage = (service: string) => {
    setContent(prev => ({
      ...prev,
      servicePages: {
        ...prev.servicePages,
        [service]: {
          ...prev.servicePages[service],
          carouselImages: [...prev.servicePages[service].carouselImages, { imageUrl: '' }]
        }
      }
    }))
  }

  const handleWhatWeDoChange = (service: string, field: 'description' | 'cards', value: string | WhatWeDoCard, index?: number) => {
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
    } else if (field === 'cards' && typeof index === 'number') {
      setContent(prev => ({
        ...prev,
        servicePages: {
          ...prev.servicePages,
          [service]: {
            ...prev.servicePages[service],
            whatWeDo: {
              ...prev.servicePages[service].whatWeDo,
              cards: prev.servicePages[service].whatWeDo.cards.map((card, i) => 
                i === index ? value as WhatWeDoCard : card
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify(content));

      const appendImages = async (items: any[], prefix: string) => {
        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          if (item.imageUrl && (item.imageUrl.startsWith('blob:') || item.imageUrl.startsWith('data:'))) {
            const file = await fetchAndCreateFile(item.imageUrl, `${prefix}_${index}`);
            if (file) {
              formData.append('images', file, file.name);
            }
          }
        }
      };

      await appendImages(content.whyChooseUs, 'whyChooseUs');
      await appendImages(content.services, 'services');
      
      for (let index = 0; index < content.clients.length; index++) {
        const client = content.clients[index];
        if (client.logoUrl && (client.logoUrl.startsWith('blob:') || client.logoUrl.startsWith('data:'))) {
          const file = await fetchAndCreateFile(client.logoUrl, `client_${index}`);
          if (file) {
            formData.append('images', file, file.name);
          }
        }
      }

      for (const service of Object.keys(content.servicePages)) {
        await appendImages(content.servicePages[service].carouselImages, `${service}_carousel`);
      }

      const response = await fetch('/api/content', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Content updated successfully');
        // Optionally, you can show a success message to the user
      } else {
        console.error('Failed to update content');
        // Optionally, you can show an error message to the user
      }
    } catch (error) {
      console.error('Error updating content:', error);
      // Optionally, you can show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAndCreateFile = async (url: string, filename: string): Promise<File | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const extension = blob.type.split('/')[1];
      return new File([blob], `${filename}.${extension}`, { type: blob.type });
    } catch (error) {
      console.error('Error fetching file:', error);
      return null;
    }
  };

  const dataURLtoFile = async (dataUrl: string, filename: string): Promise<File | null> => {
    if (dataUrl.startsWith('blob:')) {
      try {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        return new File([blob], filename, { type: blob.type });
      } catch (error) {
        console.error('Error converting blob URL to File:', error);
        return null;
      }
    }
    
    if (!dataUrl.startsWith('data:')) {
      console.error('Invalid data URL:', dataUrl);
      return null;
    }
    
    const arr = dataUrl.split(',');
    if (arr.length < 2) {
      console.error('Invalid data URL format');
      return null;
    }
    const mime = arr[0].match(/:(.*?);/)?.[1];
    if (!mime) {
      console.error('Could not extract MIME type from data URL');
      return null;
    }
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

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
    <Suspense fallback={<div>Loading...</div>}>
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
                      onChange={(e) => handleHeroChange('description', e.target.value)}
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
                              if (file) handleWhyChooseUsChange(index, 'imageUrl', file);
                            }}
                            accept="image/*"
                          />
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={`Preview of ${item.title}`} className="w-24 h-24 object-cover" />
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
                              if (file) handleServicesChange(index, 'imageUrl', file);
                            }}
                            accept="image/*"
                          />
                          {service.imageUrl && (
                            <img src={service.imageUrl} alt={`Preview of ${service.title}`} className="w-24 h-24 object-cover" />
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
                              if (file) handleClientLogoChange(index, file);
                            }}
                            accept="image/*"
                            className="mb-2"
                          />
                          {client.logoUrl && (
                            <img src={client.logoUrl} alt={`Client logo ${index + 1}`} className="w-24 h-24 object-contain mb-2" />
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
                {Object.keys(content.servicePages).map((service) => (
                  <TabButton
                    key={service}
                    id={service}
                    active={activeServicePageTab === service}
                    onClick={() => setActiveServicePageTab(service)}
                  >
                    {service.charAt(0).toUpperCase() + service.slice(1)}
                  </TabButton>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>{activeServicePageTab.charAt(0).toUpperCase() + activeServicePageTab.slice(1)} Service Page</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <textarea
                    placeholder="Description"
                    value={content.servicePages[activeServicePageTab]?.description || ''}
                    onChange={(e) => handleServicePageChange(activeServicePageTab, 'description', e.target.value)}
                    rows={3}
                    className='flex min-h-[80px] w-full rounded-md border border-input bg-slate-50 dark:bg-zinc-500 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Image Carousel</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {content.servicePages[activeServicePageTab]?.carouselImages.map((img, index) => (
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
                          {img.imageUrl && (
                            <img src={img.imageUrl} alt={`Carousel image ${index + 1}`} className="w-24 h-24 object-cover" />
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
                      value={content.servicePages[activeServicePageTab]?.whatWeDo?.description || ''}
                      onChange={(e) => handleWhatWeDoChange(activeServicePageTab, 'description', e.target.value)}
                      rows={3}
                      className="mb-2 flex min-h-[80px] w-full rounded-md border border-input bg-slate-50 dark:bg-zinc-500 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {content.servicePages[activeServicePageTab]?.whatWeDo?.cards.map((card, index) => (
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
    </Suspense>
  )
}

