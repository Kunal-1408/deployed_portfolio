"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import Image from "next/image"
import { ImageLightbox } from "@/components/image-lightbox"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, ExternalLink, Users, BarChart3, Calendar } from "lucide-react"

interface SocialPlatform {
  name: string
  url: string
  handle: string
  followers?: number
  engagement?: number
  description?: string
}

interface SocialMediaSection {
  description: string
  platforms: SocialPlatform[]
}

interface LogoSection {
  logo: string
  description: string
}

interface BannerSection {
  description: string
  banners: string[]
}

interface AnalyticsSection {
  description: string
  metrics: {
    name: string
    value: string
    change?: number
    period?: string
  }[]
}

interface CampaignSection {
  description: string
  campaigns: {
    name: string
    description: string
    startDate?: string
    endDate?: string
    status: string
    results?: string
    images: string[]
  }[]
}

interface Social {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description: string
  clientName?: string
  logoSection: LogoSection
  bannerSection: BannerSection
  socialMediaSection: SocialMediaSection
  analyticsSection?: AnalyticsSection
  campaignSection?: CampaignSection
  tags: string[]
  archive: boolean
  highlighted: boolean

  // Legacy fields for compatibility
  Brand?: string
  Description?: string
  Logo?: string | null
  URL?: string[]
  banner?: string
  Tags?: string[]
}

export default function SocialDetails() {
  const params = useParams()
  const router = useRouter()
  const socialId = params.id as string
  const [social, setSocial] = useState<Social | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [allImages, setAllImages] = useState<{ src: string; alt: string }[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchSocialDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/fetch?id=${socialId}&type=social`)

        if (!response.ok) {
          throw new Error(`Failed to fetch social details: ${response.status}`)
        }

        const data = await response.json()

        if (data.social) {
          setSocial(data.social)

          // Prepare all images for the lightbox
          const images: { src: string; alt: string }[] = []

          // Add logo
          if (data.social.logoSection && data.social.logoSection.logo) {
            images.push({
              src: data.social.logoSection.logo,
              alt: `${data.social.title || data.social.Brand || "Brand"} Logo`,
            })
          }

          // Add banners
          if (
            data.social.bannerSection &&
            data.social.bannerSection.banners &&
            data.social.bannerSection.banners.length > 0
          ) {
            data.social.bannerSection.banners.forEach((banner: string, idx: number) => {
              images.push({
                src: banner,
                alt: `${data.social.title || data.social.Brand || "Brand"} Banner ${idx + 1}`,
              })
            })
          }

          // Add campaign images
          if (
            data.social.campaignSection &&
            data.social.campaignSection.campaigns &&
            data.social.campaignSection.campaigns.length > 0
          ) {
            data.social.campaignSection.campaigns.forEach((campaign) => {
              if (campaign.images && campaign.images.length > 0) {
                campaign.images.forEach((image: string, idx: number) => {
                  images.push({
                    src: image,
                    alt: `${campaign.name} Campaign Image ${idx + 1}`,
                  })
                })
              }
            })
          }

          setAllImages(images)
        } else {
          setError("Social media content not found")
        }
      } catch (err) {
        console.error("Error fetching social details:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (socialId) {
      fetchSocialDetails()
    }
  }, [socialId])

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const handleNavigate = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < allImages.length) {
      setCurrentImageIndex(newIndex)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const formatNumber = (num?: number) => {
    if (num === undefined) return "N/A"
    return new Intl.NumberFormat().format(num)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error || !social) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-red-500">{error || "Social media content not found"}</div>
      </div>
    )
  }

  // Get display values (handling both new and legacy data structures)
  const title = social.title || social.Brand || ""
  const description = social.description || social.Description || ""
  const clientName = social.clientName || ""
  const tags = [...(social.tags || []), ...(social.Tags || [])]

  return (
    <div className="min-h-screen bg-white pt-16 relative">
      {/* Sticky Back Button */}
      <motion.button
        className={`fixed top-28 left-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-md transition-all ${
          scrolled ? "bg-brand-teal text-black" : "bg-white text-brand-teal border border-brand-teal"
        }`}
        onClick={handleBack}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="font-medium">Back</span>
      </motion.button>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-semibold tracking-wide text-brand-teal">
              <span className="font-bold">{title}</span>
              {clientName && (
                <span className="block text-lg md:text-xl tracking-[0.3em] text-brand-gold mt-2 font-medium">
                  {clientName}
                </span>
              )}
            </h1>
            <div className="w-24 h-[2px] bg-brand-gold mx-auto my-6"></div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto font-light tracking-wide">
            {description}
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="bg-white/0.2 text-gray-800 text-sm font-medium px-3 py-1 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        <div className="space-y-32">
          {/* Logo Section */}
          {social.logoSection && social.logoSection.logo && (
            <GallerySection
              title="Brand Identity"
              description={social.logoSection.description || "Brand identity through distinctive logo design."}
            >
              <div className="space-y-6">
                <div className="relative w-96 h-96 mx-auto perspective-1000">
                  <AnimatePresence>
                    <motion.div
                      key="logo-container"
                      className="relative w-full h-full rounded-full border-4 border-brand-gold/20 p-8 bg-brand-teal/5 cursor-pointer overflow-hidden"
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: 1080 }}
                      transition={{ duration: 2, ease: "easeInOut" }}
                      whileHover={{ scale: 1.05 }}
                      onAnimationComplete={() => setLogoAnimationComplete(true)}
                      onClick={() => openLightbox(0)}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <Image
                        src={social.logoSection.logo || "/placeholder.svg"}
                        alt={`${title} Logo`}
                        className="object-contain"
                        fill
                        sizes="(max-width: 384px) 100vw"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </GallerySection>
          )}

          {/* Social Media Platforms Section */}
          {social.socialMediaSection &&
            social.socialMediaSection.platforms &&
            social.socialMediaSection.platforms.length > 0 && (
              <GallerySection
                title="Social Media Presence"
                description={
                  social.socialMediaSection.description || "Building brand awareness across multiple social platforms."
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {social.socialMediaSection.platforms.map((platform, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      whileHover={{
                        y: -10,
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold text-brand-teal">{platform.name}</h3>
                          <motion.a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-brand-gold"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </motion.a>
                        </div>

                        <p className="text-gray-600 font-medium">@{platform.handle}</p>

                        {platform.description && <p className="text-gray-500 text-sm">{platform.description}</p>}

                        <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                          {platform.followers !== undefined && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Followers</p>
                                <p className="font-semibold">{formatNumber(platform.followers)}</p>
                              </div>
                            </div>
                          )}

                          {platform.engagement !== undefined && (
                            <div className="flex items-center gap-2">
                              <BarChart3 className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Engagement</p>
                                <p className="font-semibold">{platform.engagement}%</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GallerySection>
            )}

          {/* Banner Section */}
          {social.bannerSection && social.bannerSection.banners && social.bannerSection.banners.length > 0 && (
            <GallerySection
              title="Social Media Banners"
              description={social.bannerSection.description || "Consistent visual identity across social platforms."}
            >
              <div className="flex flex-col space-y-12">
                {social.bannerSection.banners.map((banner, idx) => (
                  <motion.div
                    key={idx}
                    className="relative aspect-[21/9] w-full cursor-pointer overflow-hidden rounded-lg shadow-lg"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: idx * 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openLightbox(social.logoSection?.logo ? idx + 1 : idx)}
                  >
                    <Image
                      src={banner || "/placeholder.svg"}
                      alt={`${title} Banner ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1200px) 100vw"
                    />
                  </motion.div>
                ))}
              </div>
            </GallerySection>
          )}

          {/* Analytics Section */}
          {social.analyticsSection && social.analyticsSection.metrics && social.analyticsSection.metrics.length > 0 && (
            <GallerySection
              title="Performance Analytics"
              description={social.analyticsSection.description || "Measuring impact and engagement across platforms."}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {social.analyticsSection.metrics.map((metric, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <h3 className="text-lg font-medium text-gray-500 mb-2">{metric.name}</h3>
                    <div className="flex items-end gap-3">
                      <p className="text-3xl font-bold text-brand-teal">{metric.value}</p>
                      {metric.change !== undefined && (
                        <div
                          className={`text-sm font-medium ${metric.change >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          {metric.change >= 0 ? "+" : ""}
                          {metric.change}%
                        </div>
                      )}
                    </div>
                    {metric.period && <p className="text-xs text-gray-400 mt-1">{metric.period}</p>}
                  </motion.div>
                ))}
              </div>
            </GallerySection>
          )}

          {/* Campaign Section */}
          {social.campaignSection &&
            social.campaignSection.campaigns &&
            social.campaignSection.campaigns.length > 0 && (
              <GallerySection
                title="Social Media Campaigns"
                description={
                  social.campaignSection.description || "Strategic campaigns designed to engage and convert."
                }
              >
                <div className="space-y-16">
                  {social.campaignSection.campaigns.map((campaign, campaignIdx) => (
                    <motion.div
                      key={campaignIdx}
                      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: campaignIdx * 0.2 }}
                    >
                      <div className="p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-brand-teal">{campaign.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  campaign.status === "Active"
                                    ? "bg-green-100 text-green-800"
                                    : campaign.status === "Completed"
                                      ? "bg-blue-100 text-blue-800"
                                      : campaign.status === "Planned"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {campaign.status}
                              </span>

                              {campaign.startDate && (
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {campaign.startDate}
                                  {campaign.endDate && ` - ${campaign.endDate}`}
                                </div>
                              )}
                            </div>
                          </div>

                          {campaign.results && (
                            <div className="bg-brand-teal/10 px-4 py-2 rounded-lg">
                              <p className="text-sm font-medium text-brand-teal">{campaign.results}</p>
                            </div>
                          )}
                        </div>

                        <p className="text-gray-600 mb-8">{campaign.description}</p>

                        {campaign.images && campaign.images.length > 0 && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {campaign.images.map((image, imageIdx) => {
                              // Calculate the correct index for the lightbox
                              const logoOffset = social.logoSection?.logo ? 1 : 0
                              const bannerOffset = social.bannerSection?.banners?.length || 0

                              // Calculate the offset for previous campaign images
                              let previousCampaignImagesCount = 0
                              for (let i = 0; i < campaignIdx; i++) {
                                previousCampaignImagesCount += social.campaignSection?.campaigns[i].images?.length || 0
                              }

                              const lightboxIndex = logoOffset + bannerOffset + previousCampaignImagesCount + imageIdx

                              return (
                                <motion.div
                                  key={imageIdx}
                                  className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md"
                                  whileHover={{
                                    scale: 1.05,
                                    rotateX: 5,
                                    rotateY: 5,
                                    z: 20,
                                  }}
                                  transition={{ duration: 0.2 }}
                                  onClick={() => openLightbox(lightboxIndex)}
                                >
                                  <Image
                                    src={image || "/placeholder.svg"}
                                    alt={`${campaign.name} Campaign Image ${imageIdx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                </motion.div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GallerySection>
            )}
        </div>

        {/* Lightbox */}
        {lightboxOpen && (
          <ImageLightbox
            images={allImages}
            currentIndex={currentImageIndex}
            onClose={() => setLightboxOpen(false)}
            onNavigate={handleNavigate}
          />
        )}
      </div>
    </div>
  )
}

function GallerySection({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      className="space-y-12"
    >
      <div className="space-y-4 text-center">
        <h2 className="text-2xl md:text-4xl font-bold tracking-wide text-brand-teal">{title}</h2>
        <div className="w-16 h-[2px] bg-brand-gold mx-auto"></div>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
          {description}
        </p>
      </div>
      {children}
    </motion.section>
  )
}

