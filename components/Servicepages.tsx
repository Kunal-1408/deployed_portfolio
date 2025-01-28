"use client"

import { useState, useEffect, useMemo } from "react"
import { ArrowRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

interface ServicePageProps {
  serviceType: "branding" | "design" | "seo" | "webDevelopment"
  data: {
    carouselImages: { imageUrl: string }[]
    description: string
    whatWeDo: {
      cards: { title: string; description: string }[]
      description: string
    }
  }
}

export default function ServicePage({ serviceType, data }: ServicePageProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  const images = useMemo(() => data.carouselImages.map((img) => img.imageUrl), [data.carouselImages])
  const services = useMemo(() => data.whatWeDo.cards, [data.whatWeDo.cards])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-full mx-auto py-10 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 mb-8 ml-20 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-16">
              {capitalizeFirstLetter(serviceType)} <span className="text-orange-400">SERVICES</span>
            </h1>
            <p className="text-lg text-gray-600" dangerouslySetInnerHTML={{ __html: data.description }} />
          </div>
          <div className="w-1/2 relative overflow-hidden rounded-lg mx-10 py-12">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              {images.map((src, index) => (
                <Image
                  key={index}
                  src={src || "/placeholder.svg"}
                  alt={`Carousel image ${index + 1}`}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover flex-shrink-0"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-12 px-4 md:px-6 lg:px-8 ">
        <div className="w-full">
          <h2 className="text-4xl md:text-5xl font-bold mb-5 ml-20 text-left">WHAT WE DO</h2>
          <p
            className="text-left ml-20 mb-12 max-w-3xl"
            dangerouslySetInnerHTML={{ __html: data.whatWeDo.description }}
          />
          <div className="grid grid-cols-3 lg:grid-cols-3 mx-auto mb-8 max-w-[1200px]">
            {services.slice(0, 3).map((service, index) => (
              <Card
                key={index}
                className={`transition-all duration-500 hover:bg-orange-400 group h-[450px] w-[350px] ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <CardTitle
                    className="text-xl font-semibold group-hover:text-white"
                    dangerouslySetInnerHTML={{ __html: service.title }}
                  />
                </CardHeader>
                <CardContent>
                  <p
                    className="text-sm group-hover:text-white"
                    dangerouslySetInnerHTML={{ __html: service.description }}
                  />
                </CardContent>
                <CardFooter>
                  <ArrowRight className="w-6 h-6 text-orange-400 group-hover:text-white" />
                </CardFooter>
              </Card>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] w-full">
              {services.slice(3).map((service, index) => (
                <Card
                  key={index + 3}
                  className={`transition-all duration-500 hover:bg-orange-400 group h-[450px] w-[350px] ${
                    isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                  style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                >
                  <CardHeader>
                    <CardTitle
                      className="text-xl font-semibold group-hover:text-white"
                      dangerouslySetInnerHTML={{ __html: service.title }}
                    />
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-sm group-hover:text-white"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    />
                  </CardContent>
                  <CardFooter>
                    <ArrowRight className="w-6 h-6 text-orange-400 group-hover:text-white" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

