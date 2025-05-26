"use client"

import { useState, useEffect } from "react"
import { MasonryGrid } from "@/components/masonry-grid"
import { fetchYouTubeVideos } from "@/lib/youtube"
import { Loader2 } from "lucide-react"
import { FeaturedVideos } from "./featured-videos"
import { YouTubePlayerModal } from "./youtube-player-modal"

export interface VideoItem {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  height: number
}

export function VideoPortfolio() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  // Simplified categories - no playlists for now
  const categories = [
    { id: "all", name: "All Videos" },
    { id: "commercials", name: "Commercials" },
    { id: "music", name: "Music Videos" },
    { id: "corporate", name: "Corporate" },
    { id: "events", name: "Events" },
  ]

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch videos with the selected category
        const data = await fetchYouTubeVideos(selectedCategory !== "all" ? selectedCategory : undefined)

        // Transform the data for the masonry grid
        const formattedVideos = data.map((video, index) => ({
          ...video,
          height: Math.floor(Math.random() * 100) + 400, // Random height for masonry layout
        }))

        setVideos(formattedVideos)
      } catch (err) {
        console.error("Failed to fetch videos:", err)
        setError("Failed to load videos. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [selectedCategory])

  // Get featured videos (first 5 videos or videos marked as featured)
  const featuredVideos = videos.slice(0, 5)

  // Transform videos into the format expected by MasonryGrid with more varied sizes
  const masonryItems = videos.map((video, index) => {
    // Create more variation in sizes
    const isPortrait = index % 5 === 0 || index % 7 === 0 // Some videos will be portrait
    const isWide = index % 4 === 0 // Some videos will be extra wide

    // Base height varies more dramatically now
    const baseHeight = isPortrait ? 600 : isWide ? 350 : 450
    const randomVariation = Math.floor(Math.random() * 200) - 100 // -100 to +100

    return {
      id: video.id,
      height: baseHeight + randomVariation,
      image: video.thumbnailUrl,
      video: video,
      isPortrait: isPortrait,
      isWide: isWide,
    }
  })

  const handlePlayVideo = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  return (
    <div className="space-y-8">
      {/* Featured Videos Section */}
      {!loading && !error && featuredVideos.length > 0 && (
        <FeaturedVideos videos={featuredVideos} onPlayVideo={handlePlayVideo} />
      )}

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 justify-center max-w-6xl mx-auto">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
              selectedCategory === category.id
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "text-orange-600 border border-orange-600 bg-white hover:bg-orange-50"
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => setSelectedCategory(selectedCategory)}
            className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No videos found. Try a different category.</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">All Videos</h2>
          <CustomMasonryGrid items={masonryItems} />
        </div>
      )}

      {/* Video Player Modal */}
      <YouTubePlayerModal
        videoId={selectedVideo || ""}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </div>
  )
}

function CustomMasonryGrid({ items }: { items: any[] }) {
  return <MasonryGrid data={items} className="min-h-[800px]" />
}
