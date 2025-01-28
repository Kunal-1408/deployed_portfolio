"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { TextsWhyChooseUs } from "@prisma/client"

interface WhyChooseUsProps {
  whyChooseUs: TextsWhyChooseUs[]
}

export default function Choose({ whyChooseUs }: WhyChooseUsProps) {
  const [activeImage, setActiveImage] = useState(whyChooseUs[0].imageUrl)
  const [previousImage, setPreviousImage] = useState(whyChooseUs[0].imageUrl)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (activeImage !== previousImage) {
      setIsTransitioning(true)
      const timer = setTimeout(() => {
        setPreviousImage(activeImage)
        setIsTransitioning(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [activeImage, previousImage])

  return (
    <div className="container w-full py-8 md:grid md:grid-cols-3 gap-10 overflow-hidden">
      <div className="grid grid-cols-1 gap-4 col-span-1 md:col-span-1 w-full">
        {whyChooseUs.map((item, index) => (
          <div key={index} className="flex flex-col md:block">
            <Card
              className={`cursor-pointer transition-all duration-300 ease-in-out hover:bg-neutral-100 group h-fit w-full ${
                index === activeIndex ? "ring-2 ring-primary" : ""
              }`}
              onMouseEnter={() => {
                setActiveImage(item.imageUrl)
                setActiveIndex(index)
              }}
            >
              <CardContent className="p-6">
                <h2
                  className="text-xl font-semibold mb-2 transition-colors duration-300"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p
                  className="text-sm transition-colors duration-300"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </CardContent>
            </Card>
            <div className="md:hidden w-full h-48 mt-4 mb-8 overflow-hidden rounded-lg shadow-lg">
              <img
                src={item.imageUrl || "/placeholder.svg"}
                alt={`Feature showcase for ${item.title}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-hidden rounded-lg shadow-lg relative h-[550px] w-full md:h-[400px] col-span-2">
        <img
          ref={imageRef}
          src={previousImage || "/placeholder.svg"}
          alt="Feature showcase"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        />
        <img
          src={activeImage || "/placeholder.svg"}
          alt="Feature showcase"
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isTransitioning ? "opacity-100" : "opacity-0"}`}
        />
      </div>
    </div>
  )
}

