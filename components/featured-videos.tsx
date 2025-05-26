"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { VideoItem } from "./video-portfolio"
import { formatDistanceToNow } from "date-fns"

interface FeaturedVideosProps {
  videos: VideoItem[]
  onPlayVideo: (videoId: string) => void
}

export function FeaturedVideos({ videos, onPlayVideo }: FeaturedVideosProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const previewRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const featuredVideo = videos[currentIndex]

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Handle hover state with delay to prevent flickering
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovering(true)
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
  }

  // Load preview when hovering (only on desktop)
  useEffect(() => {
    if (isHovering && previewRef.current && !previewLoaded && featuredVideo) {
      previewRef.current.src = `https://www.youtube.com/embed/${featuredVideo.id}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${featuredVideo.id}&start=10&enablejsapi=1`
      setPreviewLoaded(true)
    }

    if (!isHovering) {
      setPreviewLoaded(false)
    }
  }, [isHovering, featuredVideo, previewLoaded])

  const nextVideo = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length)
    setPreviewLoaded(false)
  }

  const prevVideo = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length)
    setPreviewLoaded(false)
  }

  if (!featuredVideo) return null

  return (
    <div className="mb-8 md:mb-16 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4 md:mb-6 text-orange-600 text-center">Featured Work</h2>

      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden shadow-2xl aspect-video md:aspect-video sm:aspect-[4/3] max-h-[600px]"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Main featured video */}
        <div className="relative w-full h-full">
          {/* Thumbnail image */}
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
              isHovering ? "opacity-0" : "opacity-100"
            }`}
            style={{ backgroundImage: `url(${featuredVideo.thumbnailUrl})` }}
          />

          {/* Video preview on hover (desktop only) */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${
              isHovering && previewLoaded ? "opacity-100" : "opacity-0"
            }`}
          >
            <iframe
              ref={previewRef}
              className="w-full h-full"
              title={`Preview of ${featuredVideo.title}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>

          {/* Gradient overlay - stronger on mobile for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-4 sm:p-6 md:p-10">
            <div className="max-w-3xl text-center w-full">
              <div className="text-white/90 text-xs sm:text-sm mb-1 sm:mb-2">
                {formatDistanceToNow(new Date(featuredVideo.publishedAt), { addSuffix: true })}
              </div>
              <h3 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-2 sm:mb-3 line-clamp-2">
                {featuredVideo.title}
              </h3>
              <p className="text-white/90 text-xs sm:text-sm md:text-base mb-3 sm:mb-6 line-clamp-2 md:line-clamp-3 max-w-lg mx-auto">
                {featuredVideo.description}
              </p>
              <Button
                onClick={() => onPlayVideo(featuredVideo.id)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md transition-colors duration-300 w-auto sm:w-auto"
                size={isMobile ? "default" : "lg"}
              >
                <Play className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span>Play Video</span>
              </Button>
            </div>
          </div>

          {/* Navigation arrows - larger touch targets on mobile */}
          <button
            onClick={(e) => {
              e.preventDefault()
              prevVideo()
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors duration-300"
            aria-label="Previous video"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault()
              nextVideo()
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors duration-300"
            aria-label="Next video"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>
      </div>

      {/* Thumbnails for quick navigation - scrollable on mobile */}
      <div className="flex justify-center mt-2 sm:mt-4 space-x-1 sm:space-x-2 overflow-x-auto pb-2 px-2">
        {videos.slice(0, 5).map((video, index) => (
          <button
            key={video.id}
            onClick={() => {
              setCurrentIndex(index)
              setPreviewLoaded(false)
            }}
            className={`relative flex-shrink-0 w-16 h-12 sm:w-24 sm:h-16 md:w-32 md:h-20 rounded-md overflow-hidden transition-all duration-300 ${
              currentIndex === index ? "ring-2 ring-orange-600 scale-105" : "opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={video.thumbnailUrl || "/placeholder.svg"}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
