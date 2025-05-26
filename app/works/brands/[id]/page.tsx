"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "framer-motion"
import Image from "next/image"
import { ImageLightbox } from "@/components/image-lightbox"
import { useParams, useRouter } from "next/navigation"
import { ChevronLeft, File, FileText, Play } from "lucide-react"

// Updated interface for dynamic sections
interface Asset {
  id: string
  url: string
  name: string
  type: string
}

interface Section {
  id: string
  type: string
  title: string
  description: string
  assets: Asset[]
}

interface Branding {
  id: string
  createdAt: string
  updatedAt: string
  title: string
  description: string
  clientName?: string
  sections: Section[]
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

  // Legacy section fields for backward compatibility
  logoSection?: {
    logo: string
    description: string
  }
  bannerSection?: {
    description: string
    banners: string[]
  }
  standeeSection?: {
    description: string
    standees: string[]
  }
  cardSection?: {
    description: string
    card: string[]
  }
  goodiesSection?: {
    description: string
    goodies: string[]
  }
}

// Helper function to determine asset type
const getAssetType = (url: string): string => {
  const extension = url.split(".").pop()?.toLowerCase() || ""
  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension)) return "image"
  if (["mp4", "webm", "mov", "avi"].includes(extension)) return "video"
  if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) return "document"
  if (["mp3", "wav", "ogg"].includes(extension)) return "audio"
  return "other"
}

export default function BrandingDetails() {
  const params = useParams()
  const router = useRouter()
  const brandingId = params.id as string
  const [branding, setBranding] = useState<Branding | null>(null)
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
    const fetchBrandingDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/fetch?id=${brandingId}&type=branding`)

        if (!response.ok) {
          throw new Error(`Failed to fetch branding details: ${response.status}`)
        }

        const data = await response.json()

        if (data.branding) {
          setBranding(data.branding)

          // Prepare all images for the lightbox
          const images: { src: string; alt: string }[] = []

          // Handle new dynamic sections structure
          if (data.branding.sections && Array.isArray(data.branding.sections)) {
            data.branding.sections.forEach((section) => {
              if (section.assets && Array.isArray(section.assets)) {
                section.assets.forEach((asset, idx) => {
                  if (asset.type === "image" || getAssetType(asset.url) === "image") {
                    images.push({
                      src: asset.url,
                      alt: `${data.branding.title || "Brand"} - ${section.title} - ${asset.name || `Asset ${idx + 1}`}`,
                    })
                  }
                })
              }
            })
          }
          // Fallback to legacy structure if needed
          else {
            // Add logo
            if (data.branding.logoSection && data.branding.logoSection.logo) {
              images.push({
                src: data.branding.logoSection.logo,
                alt: `${data.branding.title || data.branding.Brand || "Brand"} Logo`,
              })
            }

            // Add banners
            if (
              data.branding.bannerSection &&
              data.branding.bannerSection.banners &&
              data.branding.bannerSection.banners.length > 0
            ) {
              data.branding.bannerSection.banners.forEach((banner: string, idx: number) => {
                images.push({
                  src: banner,
                  alt: `${data.branding.title || data.branding.Brand || "Brand"} Banner ${idx + 1}`,
                })
              })
            }

            // Add standees
            if (
              data.branding.standeeSection &&
              data.branding.standeeSection.standees &&
              data.branding.standeeSection.standees.length > 0
            ) {
              data.branding.standeeSection.standees.forEach((standee: string, idx: number) => {
                images.push({
                  src: standee,
                  alt: `${data.branding.title || data.branding.Brand || "Brand"} Standee ${idx + 1}`,
                })
              })
            }

            // Add cards
            if (
              data.branding.cardSection &&
              data.branding.cardSection.card &&
              data.branding.cardSection.card.length > 0
            ) {
              data.branding.cardSection.card.forEach((card: string, idx: number) => {
                images.push({
                  src: card,
                  alt: `${data.branding.title || data.branding.Brand || "Brand"} Card ${idx === 0 ? "Front" : "Back"}`,
                })
              })
            }

            // Add goodies
            if (
              data.branding.goodiesSection &&
              data.branding.goodiesSection.goodies &&
              data.branding.goodiesSection.goodies.length > 0
            ) {
              data.branding.goodiesSection.goodies.forEach((goodie: string, idx: number) => {
                images.push({
                  src: goodie,
                  alt: `${data.branding.title || data.branding.Brand || "Brand"} Goodie ${idx + 1}`,
                })
              })
            }
          }

          setAllImages(images)
        } else {
          setError("Branding not found")
        }
      } catch (err) {
        console.error("Error fetching branding details:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (brandingId) {
      fetchBrandingDetails()
    }
  }, [brandingId])

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

  // Function to render different asset types
  const renderAsset = (asset: Asset, onClick: () => void) => {
    const assetType = asset.type || getAssetType(asset.url)

    switch (assetType) {
      case "image":
        return (
          <motion.div
            className="relative aspect-auto w-full cursor-pointer overflow-hidden rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
          >
            <Image
              src={asset.url || "/placeholder.svg"}
              alt={asset.name || "Brand asset"}
              fill
              className="object-cover"
              sizes="(max-width: 1200px) 100vw"
            />
          </motion.div>
        )
      case "video":
        return (
          <motion.div
            className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-black/50 rounded-full p-4">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
            <video
              src={asset.url}
              controls={false}
              className="w-full h-full object-cover"
              onClick={() => window.open(asset.url, "_blank")}
            />
          </motion.div>
        )
      case "document":
        const isPdf = asset.url.toLowerCase().endsWith(".pdf")
        return (
          <motion.div
            className="relative border rounded-lg shadow-lg bg-gray-50 overflow-hidden flex flex-col"
            style={{ minHeight: "300px", width: "100%" }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-6 w-6 text-brand-teal mr-2" />
                <h4 className="font-medium text-lg truncate">{asset.name}</h4>
              </div>
              <button
                onClick={() => window.open(asset.url, "_blank")}
                className="text-sm px-3 py-1 bg-brand-teal text-white rounded-md hover:bg-brand-teal/80"
              >
                Open
              </button>
            </div>
            {isPdf ? (
              <div className="flex-1 min-h-[250px] w-full">
                <iframe
                  src={`${asset.url}#view=FitH`}
                  className="w-full h-full border-0"
                  title={asset.name}
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            ) : (
              <div className="p-6 flex items-center">
                <FileText className="h-12 w-12 text-brand-teal mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Click to view document</p>
                </div>
              </div>
            )}
          </motion.div>
        )
      case "audio":
        return (
          <motion.div
            className="relative p-6 border rounded-lg shadow-lg bg-gray-50"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h4 className="font-medium text-lg mb-2">{asset.name}</h4>
            <audio controls className="w-full">
              <source src={asset.url} />
              Your browser does not support the audio element.
            </audio>
          </motion.div>
        )
      default:
        return (
          <motion.div
            className="relative p-6 border rounded-lg shadow-lg bg-gray-50 flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.open(asset.url, "_blank")}
          >
            <File className="h-12 w-12 text-brand-teal mr-4" />
            <div>
              <h4 className="font-medium text-lg">{asset.name}</h4>
              <p className="text-sm text-gray-500">Click to download file</p>
            </div>
          </motion.div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  if (error || !branding) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl text-red-500">{error || "Branding not found"}</div>
      </div>
    )
  }

  // Get display values (handling both new and legacy data structures)
  const title = branding.title || branding.Brand || ""
  const description = branding.description || branding.Description || ""
  const clientName = branding.clientName || ""
  const tags = [...(branding.tags || []), ...(branding.Tags || [])]

  // Group sections by type for rendering
  const logoSection = branding.sections?.find((s) => s.type === "logo") || null
  const bannerSections = branding.sections?.filter((s) => s.type === "banner") || []
  const standeeSections = branding.sections?.filter((s) => s.type === "standee") || []
  const cardSections = branding.sections?.filter((s) => s.type === "card") || []
  const goodiesSections = branding.sections?.filter((s) => s.type === "goodies") || []
  const customSections =
    branding.sections?.filter((s) => !["logo", "banner", "standee", "card", "goodies"].includes(s.type)) || []

  // Check if we need to use legacy sections
  const useLegacySections = !branding.sections || branding.sections.length === 0

  return (
    <div className="min-h-screen bg-white pt-16 relative">
      {/* Add this near the top of the file, after the imports */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        
        [style*="backface-visibility: hidden"] {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
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
          {/* DYNAMIC SECTIONS */}
          {!useLegacySections && (
            <>
              {/* Logo Section */}
              {logoSection && logoSection.assets.length > 0 && (
                <GallerySection
                  title={logoSection.title || "Logo Design"}
                  description={logoSection.description || "Brand identity through distinctive logo design."}
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
                          onClick={() => {
                            const logoAsset = logoSection.assets.find(
                              (a) => a.type === "image" || getAssetType(a.url) === "image",
                            )
                            if (logoAsset) {
                              const index = allImages.findIndex((img) => img.src === logoAsset.url)
                              if (index !== -1) openLightbox(index)
                            }
                          }}
                          style={{ transformStyle: "preserve-3d" }}
                        >
                          {logoSection.assets[0] && (
                            <Image
                              src={logoSection.assets[0].url || "/placeholder.svg"}
                              alt={logoSection.assets[0].name || `${title} Logo`}
                              className="object-contain"
                              fill
                              sizes="(max-width: 384px) 100vw"
                            />
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </GallerySection>
              )}

              {/* Banner Sections */}
              {bannerSections.map((section, sectionIndex) => (
                <GallerySection
                  key={section.id}
                  title={section.title || "Brand Photography"}
                  description={section.description || "Visual narrative that captures the essence of the brand."}
                >
                  <div className="flex flex-col space-y-12">
                    {section.assets
                      .filter((asset) => asset.type === "image" || getAssetType(asset.url) === "image")
                      .map((asset, idx) => {
                        const imageIndex = allImages.findIndex((img) => img.src === asset.url)
                        return (
                          <motion.div
                            key={asset.id}
                            className="relative aspect-[21/9] w-full cursor-pointer overflow-hidden rounded-lg shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => imageIndex !== -1 && openLightbox(imageIndex)}
                          >
                            <Image
                              src={asset.url || "/placeholder.svg"}
                              alt={asset.name || `${title} Banner ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1200px) 100vw"
                            />
                          </motion.div>
                        )
                      })}

                    {/* Non-image assets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                      {section.assets
                        .filter((asset) => asset.type !== "image" && getAssetType(asset.url) !== "image")
                        .map((asset) => (
                          <div key={asset.id}>{renderAsset(asset, () => {})}</div>
                        ))}
                    </div>
                  </div>
                </GallerySection>
              ))}

              {/* Standee Sections */}
              {standeeSections.map((section) => (
                <GallerySection
                  key={section.id}
                  title={section.title || "Brand Display"}
                  description={section.description || "Retail presence enhanced through elegant standee displays."}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {section.assets
                      .filter((asset) => asset.type === "image" || getAssetType(asset.url) === "image")
                      .map((asset, idx) => {
                        const imageIndex = allImages.findIndex((img) => img.src === asset.url)
                        return (
                          <motion.div
                            key={asset.id}
                            className="relative aspect-[3/4] max-w-xs mx-auto cursor-pointer overflow-hidden rounded-lg shadow-md"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => imageIndex !== -1 && openLightbox(imageIndex)}
                          >
                            <Image
                              src={asset.url || "/placeholder.svg"}
                              alt={asset.name || `${title} Standee ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw"
                            />
                          </motion.div>
                        )
                      })}

                    {/* Non-image assets */}
                    {section.assets
                      .filter((asset) => asset.type !== "image" && getAssetType(asset.url) !== "image")
                      .map((asset) => (
                        <div key={asset.id}>{renderAsset(asset, () => {})}</div>
                      ))}
                  </div>
                </GallerySection>
              ))}

              {/* Card Sections */}
              {cardSections.map((section) => {
                // Find front and back card images if they exist
                const cardAssets = section.assets.filter(
                  (asset) => asset.type === "image" || getAssetType(asset.url) === "image",
                )
                const frontCard = cardAssets.length > 0 ? cardAssets[0] : null
                const backCard = cardAssets.length > 1 ? cardAssets[1] : null

                return (
                  <GallerySection
                    key={section.id}
                    title={section.title || "Business Cards"}
                    description={
                      section.description || "Every touchpoint matters. Business cards crafted with precision."
                    }
                  >
                    {(frontCard || backCard) && (
                      <div className="flex justify-center perspective-1000 mb-12">
                        <motion.div
                          className="relative w-[400px] h-[230px] cursor-pointer shadow-xl"
                          whileHover={{ rotateY: 180 }}
                          transition={{ duration: 0.6 }}
                          style={{ transformStyle: "preserve-3d" }}
                          onClick={() => {
                            if (frontCard) {
                              const imageIndex = allImages.findIndex((img) => img.src === frontCard.url)
                              if (imageIndex !== -1) openLightbox(imageIndex)
                            }
                          }}
                        >
                          {/* Front of card */}
                          {frontCard && (
                            <div
                              className="absolute w-full h-full rounded-lg overflow-hidden"
                              style={{ backfaceVisibility: "hidden" }}
                            >
                              <Image
                                src={frontCard.url || "/placeholder.svg"}
                                alt={frontCard.name || `${title} Card Front`}
                                fill
                                className="object-cover"
                                sizes="400px"
                              />
                            </div>
                          )}

                          {/* Back of card */}
                          {backCard && (
                            <div
                              className="absolute w-full h-full rounded-lg overflow-hidden"
                              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                            >
                              <Image
                                src={backCard.url || "/placeholder.svg"}
                                alt={backCard.name || `${title} Card Back`}
                                fill
                                className="object-cover"
                                sizes="400px"
                              />
                            </div>
                          )}
                        </motion.div>
                      </div>
                    )}

                    {/* Other card assets (beyond front/back) */}
                    {cardAssets.length > 2 && (
                      <div className="grid grid-cols-2 gap-6 mt-8">
                        {cardAssets.slice(2).map((asset, idx) => {
                          const imageIndex = allImages.findIndex((img) => img.src === asset.url)
                          return (
                            <motion.div
                              key={asset.id}
                              className="relative aspect-[16/9] cursor-pointer overflow-hidden rounded-lg shadow-md"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                              onClick={() => imageIndex !== -1 && openLightbox(imageIndex)}
                            >
                              <Image
                                src={asset.url || "/placeholder.svg"}
                                alt={asset.name || `${title} Card ${idx + 3}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw"
                              />
                            </motion.div>
                          )
                        })}
                      </div>
                    )}

                    {/* Non-image assets */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                      {section.assets
                        .filter((asset) => asset.type !== "image" && getAssetType(asset.url) !== "image")
                        .map((asset) => (
                          <div key={asset.id}>{renderAsset(asset, () => {})}</div>
                        ))}
                    </div>
                  </GallerySection>
                )
              })}

              {/* Goodies Sections */}
              {goodiesSections.map((section) => (
                <GallerySection
                  key={section.id}
                  title={section.title || "Packaging & Collateral"}
                  description={section.description || "Each piece deserves an exceptional presentation."}
                >
                  <div className="flex flex-wrap gap-6 justify-center">
                    {section.assets
                      .filter((asset) => asset.type === "image" || getAssetType(asset.url) === "image")
                      .map((asset, idx) => {
                        const imageIndex = allImages.findIndex((img) => img.src === asset.url)
                        return (
                          <motion.div
                            key={asset.id}
                            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md w-full max-w-[250px] flex-grow-0 flex-shrink-0"
                            style={{ flexBasis: "250px" }}
                            whileHover={{
                              scale: 1.05,
                              rotateX: 5,
                              rotateY: 5,
                              z: 20,
                            }}
                            transition={{ duration: 0.2 }}
                            onClick={() => imageIndex !== -1 && openLightbox(imageIndex)}
                          >
                            <Image
                              src={asset.url || "/placeholder.svg"}
                              alt={asset.name || `${title} Goodie ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="250px"
                            />
                          </motion.div>
                        )
                      })}
                  </div>

                  {/* Non-image assets */}
                  <div className="flex flex-wrap gap-8 mt-8">
                    {section.assets
                      .filter((asset) => asset.type !== "image" && getAssetType(asset.url) !== "image")
                      .map((asset) => (
                        <div key={asset.id} className="w-full md:w-[calc(50%-1rem)]">
                          {renderAsset(asset, () => {})}
                        </div>
                      ))}
                  </div>
                </GallerySection>
              ))}

              {/* Custom Sections */}
              {customSections.map((section) => (
                <GallerySection
                  key={section.id}
                  title={section.title || "Custom Assets"}
                  description={section.description || "Custom branding materials tailored to specific needs."}
                >
                  {/* Image assets in a grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {section.assets
                      .filter((asset) => asset.type === "image" || getAssetType(asset.url) === "image")
                      .map((asset, idx) => {
                        const imageIndex = allImages.findIndex((img) => img.src === asset.url)
                        return (
                          <motion.div
                            key={asset.id}
                            className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => imageIndex !== -1 && openLightbox(imageIndex)}
                          >
                            <Image
                              src={asset.url || "/placeholder.svg"}
                              alt={asset.name || `${section.title} ${idx + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                            />
                          </motion.div>
                        )
                      })}
                  </div>

                  {/* Non-image assets */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {section.assets
                      .filter((asset) => asset.type !== "image" && getAssetType(asset.url) !== "image")
                      .map((asset) => (
                        <div key={asset.id}>{renderAsset(asset, () => {})}</div>
                      ))}
                  </div>
                </GallerySection>
              ))}
            </>
          )}

          {/* LEGACY SECTIONS (for backward compatibility) */}
          {useLegacySections && (
            <>
              {/* Logo Section */}
              {branding.logoSection && branding.logoSection.logo && (
                <GallerySection
                  title="Logo Design"
                  description={branding.logoSection.description || "Brand identity through distinctive logo design."}
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
                            src={branding.logoSection.logo || "/placeholder.svg"}
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

              {/* Banner Section */}
              {branding.bannerSection &&
                branding.bannerSection.banners &&
                branding.bannerSection.banners.length > 0 && (
                  <GallerySection
                    title="Brand Photography"
                    description={
                      branding.bannerSection.description || "Visual narrative that captures the essence of the brand."
                    }
                  >
                    <div className="flex flex-col space-y-12">
                      {branding.bannerSection.banners.map((banner, idx) => (
                        <motion.div
                          key={idx}
                          className="relative aspect-[21/9] w-full cursor-pointer overflow-hidden rounded-lg shadow-lg"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => openLightbox(branding.logoSection?.logo ? idx + 1 : idx)}
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

              {/* Standees Section */}
              {branding.standeeSection &&
                branding.standeeSection.standees &&
                branding.standeeSection.standees.length > 0 && (
                  <GallerySection
                    title="Brand Display"
                    description={
                      branding.standeeSection.description ||
                      "Retail presence enhanced through elegant standee displays."
                    }
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {branding.standeeSection.standees.map((standee, idx) => (
                        <motion.div
                          key={idx}
                          className="relative aspect-[3/4] max-w-xs mx-auto cursor-pointer overflow-hidden rounded-lg shadow-md"
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                          onClick={() => {
                            const logoOffset = branding.logoSection && branding.logoSection.logo ? 1 : 0
                            const bannerOffset =
                              branding.bannerSection && branding.bannerSection.banners
                                ? branding.bannerSection.banners.length
                                : 0
                            openLightbox(logoOffset + bannerOffset + idx)
                          }}
                        >
                          <Image
                            src={standee || "/placeholder.svg"}
                            alt={`${title} Standee ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </GallerySection>
                )}

              {/* Card Section */}
              {branding.cardSection && branding.cardSection.card && branding.cardSection.card.length > 0 && (
                <GallerySection
                  title="Business Cards"
                  description={
                    branding.cardSection.description ||
                    "Every touchpoint matters. Business cards crafted with precision."
                  }
                >
                  <div className="flex justify-center perspective-1000">
                    <motion.div
                      className="relative w-[400px] h-[230px] cursor-pointer shadow-xl"
                      whileHover={{ rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                      style={{ transformStyle: "preserve-3d" }}
                      onClick={() => {
                        const logoOffset = branding.logoSection && branding.logoSection.logo ? 1 : 0
                        const bannerOffset =
                          branding.bannerSection && branding.bannerSection.banners
                            ? branding.bannerSection.banners.length
                            : 0
                        const standeeOffset =
                          branding.standeeSection && branding.standeeSection.standees
                            ? branding.standeeSection.standees.length
                            : 0
                        openLightbox(logoOffset + bannerOffset + standeeOffset)
                      }}
                    >
                      {/* Front of card */}
                      {branding.cardSection.card[0] && (
                        <div
                          className="absolute w-full h-full rounded-lg overflow-hidden"
                          style={{ backfaceVisibility: "hidden" }}
                        >
                          <Image
                            src={branding.cardSection.card[0] || "/placeholder.svg"}
                            alt={`${title} Card Front`}
                            fill
                            className="object-cover"
                            sizes="400px"
                          />
                        </div>
                      )}

                      {/* Back of card */}
                      {branding.cardSection.card.length > 1 && branding.cardSection.card[1] && (
                        <div
                          className="absolute w-full h-full rounded-lg overflow-hidden"
                          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                        >
                          <Image
                            src={branding.cardSection.card[1] || "/placeholder.svg"}
                            alt={`${title} Card Back`}
                            fill
                            className="object-cover"
                            sizes="400px"
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </GallerySection>
              )}

              {/* Goodies Section */}
              {branding.goodiesSection &&
                branding.goodiesSection.goodies &&
                branding.goodiesSection.goodies.length > 0 && (
                  <GallerySection
                    title="Packaging & Collateral"
                    description={
                      branding.goodiesSection.description || "Each piece deserves an exceptional presentation."
                    }
                  >
                    <div className="flex flex-wrap gap-6 justify-center">
                      {branding.goodiesSection.goodies.map((goodie, idx) => (
                        <motion.div
                          key={idx}
                          className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-md w-full max-w-[250px] flex-grow-0 flex-shrink-0"
                          style={{ flexBasis: "250px" }}
                          whileHover={{
                            scale: 1.05,
                            rotateX: 5,
                            rotateY: 5,
                            z: 20,
                          }}
                          transition={{ duration: 0.2 }}
                          onClick={() => {
                            const logoOffset = branding.logoSection && branding.logoSection.logo ? 1 : 0
                            const bannerOffset =
                              branding.bannerSection && branding.bannerSection.banners
                                ? branding.bannerSection.banners.length
                                : 0
                            const standeeOffset =
                              branding.standeeSection && branding.standeeSection.standees
                                ? branding.standeeSection.standees.length
                                : 0
                            const cardOffset =
                              branding.cardSection && branding.cardSection.card ? branding.cardSection.card.length : 0
                            openLightbox(logoOffset + bannerOffset + standeeOffset + cardOffset + idx)
                          }}
                        >
                          <Image
                            src={goodie || "/placeholder.svg"}
                            alt={`${title} Goodie ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="250px"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </GallerySection>
                )}
            </>
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
