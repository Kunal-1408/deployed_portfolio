"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const services = [
  {
    title: "Web Development",
    description: "Custom websites tailored to your unique business needs, built with cutting-edge technologies for optimal performance and user experience.",
    image: "/web.jpg",
    src: "/services/web"
  },
  {
    title: "SEO",
    description: "Boost your online visibility and rankings with our data-driven SEO strategies, helping you reach your target audience effectively.",
    image: "/SEO.jpg",
    src: "/"
  },
  {
    title: "Advertising",
    description: "Create impactful ad campaigns that resonate with your audience, leveraging multiple channels for maximum reach and conversion.",
    image: "/social.jfif",
    src: "/"
  },
  {
    title: "Digital Marketing",
    description: "Comprehensive online marketing strategies to grow your brand, engage customers, and drive measurable results across all digital platforms.",
    image: "/Digital.jpg",
    src: "/"
  },
  {
    title: "Branding",
    description: "Comprehensive online marketing strategies to grow your brand, engage customers, and drive measurable results across all digital platforms.",
    image: "/Digital.jpg",
    src: "/"
  }
]

export default function Component() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="flex justify-center items-center min-h-screen p-8">
      <div className="max-w-[1400px] w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {services.slice(0, 3).map((service, index) => (
            <Card 
              key={index} 
              className={`overflow-hidden h-[450px] transition-all duration-300 w-full min-w-[250px] relative group ${
                hoveredIndex === null || hoveredIndex === index
                  ? "hover:shadow-xl scale-100 blur-none"
                  : "scale-90 blur-[2px] grayscale"
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url(${service.image})` }}
              ></div>
              <div className="relative z-10 bg-black bg-opacity-50 h-full transition-all duration-300 group-hover:bg-opacity-30">
                <CardHeader className="p-8">
                  <CardTitle className="text-3xl font-bold text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-8 mt-20 flex flex-col items-center">
                  <p className="text-base text-white leading-relaxed text-center font-semibold tracking-wide py-6">
                    {service.description}
                  </p>
                  <Link href={service.src} passHref legacyBehavior>
                    <a className="bg-orange-400/60 text-base text-white font-semibold h-12 px-6 py-2 border hover:bg-orange-500/60 rounded-lg mt-4 flex items-center justify-center">
                      Explore
                    </a>
                  </Link>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px] w-full">
            {services.slice(3).map((service, index) => (
              <Card 
                key={index + 3} 
                className={`overflow-hidden h-[450px] transition-all duration-300 w-full min-w-[250px] relative group ${
                  hoveredIndex === null || hoveredIndex === index + 3
                    ? "hover:shadow-xl scale-100 "
                    : "scale-90 blur-[2px] grayscale"
                }`}
                onMouseEnter={() => setHoveredIndex(index + 3)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-300 filter "
                  style={{ backgroundImage: `url(${service.image})` }}
                ></div>
                <div className="relative z-10 bg-black bg-opacity-50 h-full transition-all duration-300 group-hover:bg-opacity-30">
                  <CardHeader className="p-8">
                    <CardTitle className="text-3xl font-bold text-white">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 flex flex-col mt-20 items-center">
                    <p className="text-base text-white leading-relaxed text-center font-semibold tracking-wide py-6">
                      {service.description}
                    </p>
                    <Link href={service.src} passHref legacyBehavior>
                      <a className="bg-orange-400/60 text-base text-white font-semibold h-12 px-6 py-2 border hover:bg-orange-500/60 rounded-lg mt-4 flex items-center justify-center">
                        Explore
                      </a>
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