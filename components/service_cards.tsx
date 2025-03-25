"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import type { TextsServices } from "@prisma/client"

interface ServicesProps {
  services: TextsServices[]
}

export default function ServiceCardGrid({ services }: ServicesProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile for touch optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-[1400px] w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8">
          {services.slice(0, 3).map((service, index) => (
            <Card
              key={index}
              className={`overflow-hidden h-[350px] sm:h-[400px] md:h-[450px] transition-all duration-300 w-full relative group ${
                !isMobile && (hoveredIndex === null || hoveredIndex === index)
                  ? "hover:shadow-xl scale-100 blur-none"
                  : isMobile
                    ? ""
                    : "scale-90 blur-[2px] grayscale"
              }`}
              onMouseEnter={() => !isMobile && setHoveredIndex(index)}
              onMouseLeave={() => !isMobile && setHoveredIndex(null)}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url(${service.imageUrl})` }}
              ></div>
              <div className="relative z-10 bg-black bg-opacity-50 h-full transition-all duration-300 group-hover:bg-opacity-30">
                <CardHeader className="p-4 sm:p-6 md:p-8">
                  <CardTitle
                    className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
                    dangerouslySetInnerHTML={{ __html: service.title }}
                  />
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8 mt-4 sm:mt-10 md:mt-20 flex flex-col items-center">
                  <p
                    className="text-sm sm:text-base text-white leading-relaxed text-center font-semibold tracking-wide py-2 sm:py-4 md:py-6 line-clamp-4 sm:line-clamp-none"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />
                  <Link
                    href={service.src}
                    className="bg-orange-400/60 text-sm sm:text-base text-white font-semibold h-10 sm:h-12 px-4 sm:px-6 py-2 border hover:bg-orange-500/60 rounded-lg mt-2 sm:mt-4 flex items-center justify-center w-full sm:w-auto"
                  >
                    Explore
                  </Link>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-[1000px] w-full">
            {services.slice(3).map((service, index) => (
              <Card
                key={index + 3}
                className={`overflow-hidden h-[350px] sm:h-[400px] md:h-[450px] transition-all duration-300 w-full relative group ${
                  !isMobile && (hoveredIndex === null || hoveredIndex === index + 3)
                    ? "hover:shadow-xl scale-100"
                    : isMobile
                      ? ""
                      : "scale-90 blur-[2px] grayscale"
                }`}
                onMouseEnter={() => !isMobile && setHoveredIndex(index + 3)}
                onMouseLeave={() => !isMobile && setHoveredIndex(null)}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                  style={{ backgroundImage: `url(${service.imageUrl})` }}
                ></div>
                <div className="relative z-10 bg-black bg-opacity-50 h-full transition-all duration-300 group-hover:bg-opacity-30">
                  <CardHeader className="p-4 sm:p-6 md:p-8">
                    <CardTitle
                      className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
                      dangerouslySetInnerHTML={{ __html: service.title }}
                    />
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 md:p-8 flex flex-col mt-4 sm:mt-10 md:mt-20 items-center">
                    <p
                      className="text-sm sm:text-base text-white leading-relaxed text-center font-semibold tracking-wide py-2 sm:py-4 md:py-6 line-clamp-4 sm:line-clamp-none"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                    <Link
                      href={service.src}
                      className="bg-orange-400/60 text-sm sm:text-base text-white font-semibold h-10 sm:h-12 px-4 sm:px-6 py-2 border hover:bg-orange-500/60 rounded-lg mt-2 sm:mt-4 flex items-center justify-center w-full sm:w-auto"
                    >
                      Explore
                    </Link>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

