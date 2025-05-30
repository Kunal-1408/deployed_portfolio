"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { TextsHero } from "@prisma/client"

interface AnimatedCounterProps {
  end: number
  duration?: number
  startAnimation: boolean
}

interface HeroProps {
  hero: TextsHero
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ end, duration = 2000, startAnimation }) => {
  const [count, setCount] = useState(0)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (!startAnimation) return

    startTimeRef.current = null
    setCount(0)

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }
      const progress = timestamp - startTimeRef.current
      const percentage = Math.min(progress / duration, 1)
      setCount(Math.floor(percentage * end))
      if (percentage < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, startAnimation])

  return <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-orange-400">{count}</span>
}

interface Stat {
  number: number
  text: string
}

export default function Component({ hero }: HeroProps) {
  const [startAnimation, setStartAnimation] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const stats: Stat[] = [
    { number: 8, text: "Years Work Experience" },
    { number: 900, text: "Clients Served" },
    { number: 1000, text: "Brands Catered" },
    { number: 1100, text: "Websites Delivered" },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStartAnimation(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section ref={sectionRef} className="w-full py-8 sm:py-12 md:py-16 lg:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center space-y-8 md:space-y-12">
          <div className="text-center">
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-4"
              dangerouslySetInnerHTML={{ __html: hero.title }}
            />
            <p
              className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600 mb-4"
              dangerouslySetInnerHTML={{ __html: hero.subtitle }}
            />
            <p
              className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto"
              dangerouslySetInnerHTML={{ __html: hero.description }}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            {stats.map((item, index) => (
              <Card key={index} className="relative bg-white border-2 border-orange-100 shadow-lg hover:bg-neutral-200">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white"></div>
                <CardContent className="relative flex flex-col items-center justify-center p-4 sm:p-6">
                  <div className="flex items-center">
                    <AnimatedCounter end={item.number} startAnimation={startAnimation} />
                    {item.number !== 2 && item.number !== 7 && (
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400 ml-1">+</span>
                    )}
                  </div>
                  <span className="text-sm font-semibold sm:text-sm md:text-base text-neutral-500 mt-2 text-center">
                    {item.text}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

