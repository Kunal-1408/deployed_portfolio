import type { VideoItem } from "@/components/video-portfolio"

// YouTube API configuration
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
const YOUTUBE_API_BASE_URL = "https://www.googleapis.com/youtube/v3"

// For testing, we'll use a popular YouTube channel
// Replace this with your actual channel ID when it's working
const CHANNEL_ID = "UC_x5XG1OV2P6uZZ5FSM9Ttw" // Google Developers channel

export async function fetchYouTubeVideos(category?: string): Promise<VideoItem[]> {
  if (!YOUTUBE_API_KEY) {
    console.error("YouTube API key is not configured")
    return getMockVideos(category)
  }

  try {
    // First, let's try a simpler approach - get videos from YouTube search
    // This is more reliable than channel-specific searches
    const searchParams = new URLSearchParams({
      part: "snippet",
      maxResults: "12", // Reduced to lower quota usage
      key: YOUTUBE_API_KEY,
      type: "video", // Only get videos
    })

    // If channel ID is provided, use it
    if (CHANNEL_ID && CHANNEL_ID !== "YOUR_CHANNEL_ID") {
      searchParams.append("channelId", CHANNEL_ID)
    }

    // If category is provided, use it as a search term
    if (category && category !== "all") {
      searchParams.append("q", category)
    }

    console.log("Fetching from YouTube API...")
    const response = await fetch(`${YOUTUBE_API_BASE_URL}/search?${searchParams}`)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("YouTube API error details:", errorData)
      throw new Error(`YouTube API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    console.log("YouTube API response:", data)

    if (!data.items || data.items.length === 0) {
      console.warn("No videos found in YouTube API response")
      return getMockVideos(category)
    }

    // Transform YouTube API response to our VideoItem format
    return data.items.map((item: any) => ({
      id: item.id.videoId || item.id,
      title: item.snippet.title,
      description: item.snippet.description || "No description available",
      thumbnailUrl:
        item.snippet.thumbnails.high?.url ||
        item.snippet.thumbnails.medium?.url ||
        item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      height: 0, // This will be set by the component
    }))
  } catch (error) {
    console.error("Failed to fetch YouTube videos:", error)

    // For debugging - log the API key (partially masked)
    if (YOUTUBE_API_KEY) {
      const maskedKey = YOUTUBE_API_KEY.substring(0, 4) + "..." + YOUTUBE_API_KEY.substring(YOUTUBE_API_KEY.length - 4)
      console.log("Using API key (masked):", maskedKey)
    }

    // Fallback to mock data if API fails
    return getMockVideos(category)
  }
}

// Simplified version that doesn't rely on playlists
export function fetchYouTubePlaylistVideos(category: string): Promise<VideoItem[]> {
  // For now, just return mock data for the category
  return Promise.resolve(getMockVideos(category))
}

// Mock data for demonstration (kept as fallback)
function getMockVideos(category?: string): VideoItem[] {
  const allVideos = [
    {
      id: "dQw4w9WgXcQ",
      title: "Commercial: Product Launch 2023",
      description:
        "A stunning commercial for our client's latest product launch featuring cutting-edge visual effects and storytelling. The campaign achieved record-breaking engagement and significantly increased brand awareness across all target demographics.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=orange commercial product video thumbnail",
      publishedAt: "2023-05-15T14:30:00Z",
      category: "commercials",
      height: 0,
    },
    {
      id: "9bZkp7q19f0",
      title: "Music Video: 'Summer Vibes'",
      description:
        "A vibrant music video shot on location in Miami, featuring dynamic editing and color grading. Our team worked closely with the artist to create a visual narrative that perfectly complements the song's energy and message.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=music video production beach summer",
      publishedAt: "2023-04-22T10:15:00Z",
      category: "music",
      height: 0,
    },
    {
      id: "jNQXAC9IVRw",
      title: "Corporate Overview: Tech Solutions Inc.",
      description:
        "An overview of Tech Solutions Inc.'s mission, values, and innovative approach to business challenges. This corporate video effectively communicates the company's unique value proposition and has been instrumental in their investor relations strategy.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=corporate video business office",
      publishedAt: "2023-03-10T09:45:00Z",
      category: "corporate",
      height: 0,
    },
    {
      id: "QH2-TGUlwu4",
      title: "Event Coverage: Industry Conference 2023",
      description:
        "Comprehensive coverage of the Industry Conference 2023, including keynote speeches and networking events. Our team captured the essence of this important industry gathering, providing both live streaming services and post-event highlight reels.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=conference event coverage",
      publishedAt: "2023-06-05T16:20:00Z",
      category: "events",
      height: 0,
    },
    {
      id: "9ZEURntrQXg",
      title: "Commercial: Holiday Special Campaign",
      description:
        "A heartwarming holiday commercial that captured the essence of the season for our retail client. The emotional storytelling resonated with audiences and led to a 40% increase in seasonal sales compared to the previous year.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=holiday commercial festive",
      publishedAt: "2022-12-01T12:00:00Z",
      category: "commercials",
      height: 0,
    },
    {
      id: "FTQbiNvZqaY",
      title: "Music Video: 'Electric Dreams'",
      description:
        "An innovative music video utilizing the latest in visual effects and creative direction. This project pushed the boundaries of conventional music videos with its futuristic aesthetic and groundbreaking visual techniques.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=futuristic music video electric",
      publishedAt: "2023-02-14T15:30:00Z",
      category: "music",
      height: 0,
    },
    {
      id: "YR5ApYxkU-U",
      title: "Corporate Training: Leadership Excellence",
      description:
        "A series of training videos designed to enhance leadership skills within corporate environments. These educational videos combine engaging visuals with expert insights to deliver effective professional development content.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=corporate training leadership",
      publishedAt: "2023-01-20T11:45:00Z",
      category: "corporate",
      height: 0,
    },
    {
      id: "8UVNT4wvIGY",
      title: "Event Highlight: Product Expo 2023",
      description:
        "A dynamic highlight reel showcasing the best moments from the Product Expo 2023. Our team captured the excitement and innovation on display, creating a compelling summary that continues to drive engagement long after the event.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=product expo event highlights",
      publishedAt: "2023-05-30T14:15:00Z",
      category: "events",
      height: 0,
    },
    {
      id: "kJQP7kiw5Fk",
      title: "Commercial: Lifestyle Brand Campaign",
      description:
        "A lifestyle-focused commercial campaign that resonated with the target demographic and increased brand awareness. The authentic storytelling and cinematic quality helped establish the brand as a leader in their competitive market.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=lifestyle brand commercial",
      publishedAt: "2023-04-05T09:30:00Z",
      category: "commercials",
      height: 0,
    },
    {
      id: "JGwWNGJdvx8",
      title: "Music Video: 'Rhythm & Soul'",
      description:
        "A soulful music video with artistic direction that complemented the artist's vision and musical style. The project's unique visual language and emotional depth helped the artist connect with new audiences and expand their fanbase.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=soul music video artistic",
      publishedAt: "2023-03-22T13:45:00Z",
      category: "music",
      height: 0,
    },
    {
      id: "fJ9rUzIMcZQ",
      title: "Corporate Documentary: Company History",
      description:
        "A documentary-style video chronicling the 25-year history of our client's company and their industry impact. This compelling narrative piece effectively communicates the company's legacy and vision for the future to stakeholders and new employees.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=corporate documentary history",
      publishedAt: "2023-02-28T10:00:00Z",
      category: "corporate",
      height: 0,
    },
    {
      id: "YykjpeuMNEk",
      title: "Event Coverage: Charity Gala 2023",
      description:
        "Comprehensive coverage of the annual Charity Gala, highlighting key moments and fundraising achievements. Our team provided both live coverage and a polished post-event video that helped the organization exceed their fundraising goals.",
      thumbnailUrl: "/placeholder.svg?height=720&width=1280&query=charity gala event formal",
      publishedAt: "2023-06-15T19:30:00Z",
      category: "events",
      height: 0,
    },
  ]

  if (category && category !== "all") {
    return allVideos.filter((video) => video.category === category)
  }

  return allVideos.slice(0, 12) // Return only first 12 for brevity
}
