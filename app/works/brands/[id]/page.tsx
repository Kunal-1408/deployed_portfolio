'use client'
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation'
import { Card } from "@/components/ui/card"
import Image from 'next/image'

interface BrandStats {
  impression?: string
  interactions?: string
  reach?: string
}

interface BrandProps {
  id: string
  Brand: string
  Description: string
  Logo: string
  Stats: BrandStats[]
  banner: string
  highlighted: boolean
  tags: string[]
}

export default function Component(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [brand, setBrand] = useState<BrandProps | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await fetch(`/api/brand?id=${params.id}`)
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/404')
            return
          }
          throw new Error('Failed to fetch brand')
        }
        const data = await response.json()
        if (!data) {
          console.log(data)
          router.push('/404')
          return
        }
        setBrand(data)
      } catch (error) {
        console.error('Error fetching brand:', error)
        router.push('/error')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchBrand()
    }
  }, [params.id, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!brand) {
    return null
  }

  const { Brand, Description, banner, Stats, tags } = brand

  return (
    <div className="w-full mt-12 bg-white">
      {/* Header */}
      <div className="container py-12">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Casestudy</p>
          <h1 className="text-3xl font-bold tracking-tight">
            {Brand}
          </h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative w-full h-[400px] bg-blue-400 overflow-hidden mb-16">
        <Image src={banner} alt='Banner' fill={true} className="w-full h-full object-cover"/>
      </div>

      {/* Content Section */}
      <div className="container py-16 bg-white mx-auto ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-32">
          {/* Left Column - Stats */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-6">Stats</h2>
              <div className="space-y-4">
                {Stats.map((stat, index) => (
                  <Card key={index} className="p-6 shadow-sm border border-gray-100">
                    {stat.impression && (
                      <div className="flex justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Impressions</span>
                        <span className="font-medium">{stat.impression}</span>
                      </div>
                    )}
                    {stat.interactions && (
                      <div className="flex justify-between mb-4">
                        <span className="text-sm text-muted-foreground">Interactions</span>
                        <span className="font-medium">{stat.interactions}</span>
                      </div>
                    )}
                    {stat.reach && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Reach</span>
                        <span className="font-medium">{stat.reach}</span>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Industry Tags */}
            <div>
              <h2 className="text-xl font-semibold mb-6">Industry</h2>
              <div className="space-y-3">
                {tags.map((tag, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Description */}
          <div className="md:col-span-2">
            <div className="prose max-w-none">
              <p className="text-muted-foreground text-lg leading-relaxed">
                {Description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Instagram Banner */}
      <div className="relative w-full py-24 overflow-hidden">
        <img
          src={banner}
          alt="Brand banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative container text-center space-y-6 text-white">
          <h2 className="text-5xl font-bold tracking-tight">
            SEE THE BRAND
            <br />
            IN ACTION ON INSTA
          </h2>
          <p className="text-3xl font-medium">@eatmadmix</p>
        </div>
      </div>
    </div>
  )
}