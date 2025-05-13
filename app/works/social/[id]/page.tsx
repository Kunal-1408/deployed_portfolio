"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import Image from "next/image"
import { ImageLightbox } from "@/components/image-lightbox"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, Instagram, Twitter, Facebook, Linkedin, LinkIcon, BarChart, Calendar } from "lucide-react"

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

          // Add campaign images if available
          if (data.social.campaignSection && data.social.campaignSection.campaigns) {
            data.social.campaignSection.campaigns.forEach((campaign: any) => {
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
          setError("Social project not found")
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

  const getSocialIcon = (platform: string) => {
    const platformLower = platform.toLowerCase()
    if (platformLower.includes("instagram")) return <Instagram className="h-6 w-6" />
    if (platformLower.includes("twitter") || platformLower.includes("x")) return <Twitter className="h-6 w-6" />
    if (platformLower.includes("facebook")) return <Facebook className="h-6 w-6" />
    if (platformLower.includes("linkedin")) return <Linkedin className="h-6 w-6" />
    return <LinkIcon className="h-6 w-6" />
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
        <div className="text-xl text-red-500">{error || "Social project not found"}</div>
      </div>
    )
  }

  // Get display values (handling both new and legacy data structures)
  const title = social.title || social.Brand || ""
  const description = social.description || social.Description || ""
  const clientName = social.clientName || ""
  const tags = [...(social.tags || []), ...(social.Tags || [])]
  const platforms =
    social.socialMediaSection?.platforms ||
    (social.URL
      ? social.URL.map((url) => ({
          name: url.includes("instagram")
            ? "Instagram"
            : url.includes("twitter")
              ? "Twitter"
              : url.includes("facebook")
                ? "Facebook"
                : url.includes("linkedin")
                  ? "LinkedIn"
                  : "Website",
          url,
          handle: "",
        }))
      : [])

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
              description={social.logoSection.description || "Social media presence with distinctive brand identity."}
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
          {platforms && platforms.length > 0 && (
            <GallerySection
              title="Social Media Platforms"
              description={social.socialMediaSection?.description || "Connect with us across these social platforms."}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {platforms.map((platform, idx) => (
                  <motion.a
                    key={idx}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-brand-teal mb-4">{getSocialIcon(platform.name)}</div>
                    <h3 className="text-xl font-bold mb-2">{platform.name}</h3>
                    {platform.handle && <p className="text-gray-600 mb-2">{platform.handle}</p>}
                    {platform.followers && (
                      <p className="text-gray-700">
                        <span className="font-semibold">{platform.followers.toLocaleString()}</span> followers
                      </p>
                    )}
                    {platform.description && (
                      <p className="text-gray-600 text-sm mt-2 text-center">{platform.description}</p>
                    )}
                  </motion.a>
                ))}
              </div>
            </GallerySection>
          )}

          {/* Banner Section */}
          {social.bannerSection && social.bannerSection.banners && social.bannerSection.banners.length > 0 && (
            <GallerySection
              title="Social Media Content"
              description={
                social.bannerSection.description || "Engaging visual content that resonates with our audience."
              }
            >
              <div className="flex flex-col space-y-12">
                {social.bannerSection.banners.map((banner, idx) => (
                  <motion.div
                    key={idx}
                    className="relative aspect-[21/9] w-full cursor-pointer overflow-hidden rounded-lg shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => openLightbox(social.logoSection?.logo ? idx + 1 : idx)}
                  >
                    <Image
                      src={banner || "/placeholder.svg"}
                      alt={`${title} Content ${idx + 1}`}
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
              description={
                social.analyticsSection.description || "Key metrics showcasing our social media performance."
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {social.analyticsSection.metrics.map((metric, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white p-6 rounded-xl shadow-md"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center mb-4">
                      <BarChart className="h-6 w-6 text-brand-teal mr-2" />
                      <h3 className="text-lg font-semibold">{metric.name}</h3>
                    </div>
                    <p className="text-3xl font-bold text-brand-teal mb-2">{metric.value}</p>
                    {metric.change !== undefined && (
                      <p className={`text-sm ${metric.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {metric.change >= 0 ? "↑" : "↓"} {Math.abs(metric.change).toFixed(1)}%
                        {metric.period && <span className="text-gray-500 ml-1">({metric.period})</span>}
                      </p>
                    )}
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
                  social.campaignSection.description || "Strategic campaigns designed to engage and grow our audience."
                }
              >
                <div className="space-y-12">
                  {social.campaignSection.campaigns.map((campaign, idx) => (
                    <motion.div
                      key={idx}
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <div className="md:flex">
                        {campaign.images && campaign.images.length > 0 && (
                          <div className="md:w-1/3 relative h-64 md:h-auto">
                            <Image
                              src={campaign.images[0] || "/placeholder.svg"}
                              alt={`${campaign.name} Campaign Image`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw"
                            />
                            <div
                              className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4"
                              onClick={() =>
                                openLightbox(
                                  (social.logoSection?.logo ? 1 : 0) +
                                    (social.bannerSection?.banners?.length || 0) +
                                    social.campaignSection.campaigns
                                      .slice(0, idx)
                                      .reduce((acc, camp) => acc + (camp.images?.length || 0), 0),
                                )
                              }
                            >
                              <span className="text-white text-sm font-medium">View Gallery</span>
                            </div>
                          </div>
                        )}
                        <div className="p-6 md:w-2/3">
                          <div className="flex items-center mb-2">
                            <Calendar className="h-5 w-5 text-brand-teal mr-2" />
                            <span className="text-sm text-gray-500">
                              {campaign.startDate && new Date(campaign.startDate).toLocaleDateString()}
                              {campaign.endDate && ` - ${new Date(campaign.endDate).toLocaleDateString()}`}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{campaign.name}</h3>
                          <p className="text-gray-700 mb-4">{campaign.description}</p>
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                campaign.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : campaign.status === "Completed"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {campaign.status}
                            </span>
                            {campaign.results && <span className="text-sm text-gray-600">{campaign.results}</span>}
                          </div>
                        </div>
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

