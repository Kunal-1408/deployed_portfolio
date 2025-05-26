"use client"

import { useState, useRef, useEffect } from "react"
import type { VideoItem } from "./video-portfolio"
import { Play, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface YouTubeVideoProps {
  video: VideoItem
  onPlay: () => void
}

export function YouTubeVideo({ video, onPlay }: YouTubeVideoProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [previewLoaded, setPreviewLoaded] = useState(false)
  const previewRef = useRef<HTMLIFrameElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle hover state with delay to prevent flickering
  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsHovering(true), 300)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsHovering(false), 200)
  }

  // Load preview when hovering
  useEffect(() => {
    if (isHovering && previewRef.current && !previewLoaded) {
      previewRef.current.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${video.id}&start=10&enablejsapi=1`
      setPreviewLoaded(true)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isHovering, video.id, previewLoaded])

  return (
    <div
      className="relative w-full h-full group overflow-hidden rounded-lg shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail image - always visible when not hovering */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `url(${video.thumbnailUrl})` }}
      />

      {/* Video preview on hover */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isHovering ? "opacity-100 z-10" : "opacity-0 -z-10"}`}
      >
        <iframe
          ref={previewRef}
          className="w-full h-full"
          title={`Preview of ${video.title}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>

      {/* Overlay gradient for non-hover state */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 transition-opacity duration-300 ${isHovering ? "opacity-0" : "opacity-70"}`}
      />

      {/* Full card overlay that appears on hover */}
      <div
        className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 flex flex-col justify-between p-4 ${
          isHovering ? "opacity-100 z-20" : "opacity-0 -z-10"
        }`}
      >
        <div className="flex items-center text-white/90 text-sm">
          <Calendar size={14} className="mr-1" />
          <span>{formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}</span>
        </div>

        <div className="space-y-3">
          <h3 className="text-white font-bold text-xl">{video.title}</h3>
          <p className="text-white/90 text-sm line-clamp-4">{video.description}</p>
          <button
            onClick={(e) => {
              e.preventDefault()
              onPlay()
            }}
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-3 px-5 rounded-md transition-colors duration-300 w-full font-medium"
          >
            <Play size={20} />
            <span>Play Video</span>
          </button>
        </div>
      </div>

      {/* Non-hover content */}
      <div
        className={`absolute inset-x-0 bottom-0 p-4 transition-opacity duration-300 ${isHovering ? "opacity-0" : "opacity-100"}`}
      >
        <h3 className="text-white font-bold text-xl mb-3">{video.title}</h3>
        <button
          onClick={(e) => {
            e.preventDefault()
            onPlay()
          }}
          className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-3 px-5 rounded-md transition-colors duration-300 w-full font-medium"
        >
          <Play size={20} />
          <span>Play Video</span>
        </button>
      </div>
    </div>
  )
}
