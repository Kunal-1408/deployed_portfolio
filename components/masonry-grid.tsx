"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useTransition, a } from "@react-spring/web"
import { YouTubeVideo } from "./youtube-video"

export interface MasonryItem {
  id: string | number
  height: number
  image: string
  video?: any
  isPortrait?: boolean
  isWide?: boolean
}

interface GridItem extends MasonryItem {
  x: number
  y: number
  width: number
  height: number
}

interface MasonryProps {
  data: MasonryItem[]
  className?: string
}

export function MasonryGrid({ data, className = "" }: MasonryProps) {
  // Fixed number of columns: 3
  const [columns, setColumns] = useState<number>(3)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  // Only adjust to fewer columns on very small screens
  useEffect(() => {
    const updateColumns = () => {
      if (window.matchMedia("(max-width: 640px)").matches) {
        setColumns(1) // Single column for mobile devices
      } else if (window.matchMedia("(max-width: 1024px)").matches) {
        setColumns(2) // Two columns for tablets
      } else {
        setColumns(3) // Three columns for everything else
      }
    }

    updateColumns()
    window.addEventListener("resize", updateColumns)
    return () => window.removeEventListener("resize", updateColumns)
  }, [])

  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const [heights, gridItems] = useMemo<[number[], GridItem[]]>(() => {
    const heights = new Array(columns).fill(0)
    const gridItems = data.map((child) => {
      const column = heights.indexOf(Math.min(...heights))
      const x = (width / columns) * column

      // Use a smaller divisor to make cards larger
      const divisor = child.isPortrait ? 1.2 : child.isWide ? 1.8 : 1.4
      const itemHeight = child.height / divisor

      const y = (heights[column] += itemHeight) - itemHeight
      return {
        ...child,
        x,
        y,
        width: width / columns,
        height: itemHeight,
      }
    })
    return [heights, gridItems]
  }, [columns, data, width])

  const transitions = useTransition<GridItem, { x: number; y: number; width: number; height: number; opacity: number }>(
    gridItems,
    {
      keys: (item) => item.id,
      from: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 0 }),
      enter: ({ x, y, width, height }) => ({ x, y, width, height, opacity: 1 }),
      update: ({ x, y, width, height }) => ({ x, y, width, height }),
      leave: { height: 0, opacity: 0 },
      config: { mass: 5, tension: 500, friction: 100 },
      trail: 25,
    },
  )

  return (
    <div ref={ref} className={`relative w-full ${className}`} style={{ height: Math.max(...heights) || 0 }}>
      {transitions((style, item) => (
        <a.div style={style} className="absolute p-[8px] [will-change:transform,width,height,opacity]">
          {item.video ? (
            <YouTubeVideo
              video={item.video}
              onPlay={() => {
                if (typeof window !== "undefined") {
                  // Dispatch a custom event that the parent component can listen for
                  window.dispatchEvent(new CustomEvent("play-video", { detail: { videoId: item.video.id } }))
                }
              }}
            />
          ) : (
            <div
              className="relative w-full h-full overflow-hidden rounded-lg shadow-lg"
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
        </a.div>
      ))}
    </div>
  )
}
