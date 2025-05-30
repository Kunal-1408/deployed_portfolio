"use client"

import { cn } from "@/lib/utils"
import React, { useEffect, useState } from "react"
import Image from "next/image"

export const Marquee = ({
  logos,
  direction,
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  logos: {
    logoUrl: string
    alt?: string
  }[]
  direction?: "left" | "right"
  speed?: "fast" | "normal" | "slow" | "superslow"
  pauseOnHover?: boolean
  className?: string
}) => {
  console.log("Marquee logos:", logos)

  const [start, setStart] = useState(false)
  const [starter, setStarter] = useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const scrollerRef = React.useRef<HTMLUListElement>(null)
  const containerRef1 = React.useRef<HTMLDivElement>(null)
  const scrollerRef1 = React.useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (!logos || logos.length === 0) return
    addAnimation()
    addAnimation1()
  }, [logos])

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children)

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem)
        }
      })

      getSpeed()
      setStart(true)
    }
  }

  function addAnimation1() {
    if (containerRef1.current && scrollerRef1.current) {
      const scrollerContent = Array.from(scrollerRef1.current.children)

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true)
        if (scrollerRef1.current) {
          scrollerRef1.current.appendChild(duplicatedItem)
        }
      })

      getDirection()
      getSpeed()
      setStarter(true)
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards")
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse")
      }
    }
  }

  const getSpeed = () => {
    if (containerRef.current && containerRef1.current) {
      let duration = "240s" // Default to slow

      if (speed === "fast") {
        duration = "60s"
      } else if (speed === "normal") {
        duration = "120s"
      } else if (speed === "slow") {
        duration = "240s"
      } else if (speed === "superslow") {
        duration = "320s"
      }

      containerRef.current.style.setProperty("--animation-duration", duration)
      containerRef1.current.style.setProperty("--animation-duration", duration)
    }
  }

  if (!logos || logos.length === 0) {
    return null
  }

  // Function to get the full image URL
  const getImageUrl = (path: string) => {
    // If the path starts with 'http' or 'https', return it as is
    if (path.startsWith("http")) {
      return path
    }
    // Otherwise, prepend the base URL
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${path}`
  }

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
          className,
        )}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            "flex min-w-full shrink-0 py-4 w-max flex-nowrap gap-8",
            start && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]",
            direction === "left" ? "animate-scroll-left" : "animate-scroll-right",
            speed === "slow" || speed === "superslow",
          )}
        >
          {logos.map((item, idx) => (
            <li
              className="w-[200px] h-[100px] max-w-full relative flex-shrink-0 md:w-[250px] md:h-[125px] overflow-hidden p-2"
              key={idx}
            >
              <div className="w-full h-full relative">
                <Image
                  src={getImageUrl(item.logoUrl) || "/placeholder.svg"}
                  alt={item.alt || "Logo"}
                  fill={true}
                  className="transition-all duration-300 object-contain"
                  onError={(e) => {
                    console.error(`Error loading image: ${item.logoUrl}`)
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div
        ref={containerRef1}
        className={cn(
          "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
          className,
        )}
      >
        <ul
          ref={scrollerRef1}
          className={cn(
            "flex min-w-full shrink-0 w-max flex-nowrap gap-8",
            starter && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]",
            direction === "left" ? "animate-scroll-right" : "animate-scroll-left",
            speed === "slow" || speed === "superslow",
          )}
        >
          {logos.map((item, idx) => (
            <li
              className="w-[200px] h-[100px] max-w-full relative flex-shrink-0 md:w-[250px] md:h-[125px] overflow-hidden p-2"
              key={idx}
            >
              <div className="w-full h-full relative">
                <Image
                  src={getImageUrl(item.logoUrl) || "/placeholder.svg"}
                  alt={item.alt || "Logo"}
                  fill={true}
                  className="transition-all duration-300 object-contain"
                  onError={(e) => {
                    console.error(`Error loading image: ${item.logoUrl}`)
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

