"use client"

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"

const features = [
  {
    title: "Get online fast. No design skills needed.",
    description: "Build your site in minutes. Choose from 100s of beautiful, mobile-friendly templates with our Website Builder, many with ecommerce features.",
    image: "/show1.png"
  },
  {
    title: "Build trust with email that matches your domain.",
    description: "Help boost your credibility with customers with free Professional Email that's identical to your domain name.",
    image: "/show2.png"
  },
  {
    title: "Engage with marketing tools.",
    description: "Help your audience find you with built-in SEO and promote your business with social media and email marketing tools.",
    image: "/show3.png"
  }
]

export default function Choose() {
    const [activeImage, setActiveImage] = useState(features[0].image)
    const [previousImage, setPreviousImage] = useState(features[0].image)
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
      <div className="container  w-full  py-8 grid grid-cols-3 gap-10 overflow-hidden">
         <div className="grid grid-rows-1 md:grid-rows-3 gap-4 col-span-1">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-300 ease-in-out hover:bg-neutral-100 group h-fit  ${
                index === activeIndex ? 'ring-2 ring-primary' : ''
              }`}
              onMouseEnter={() => {
                setActiveImage(feature.image)
                setActiveIndex(index)
              }}
            >
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2  transition-colors duration-300">{feature.title}</h2>
                <p className="text-sm  transition-colors duration-300">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className=" overflow-hidden rounded-lg shadow-lg relative h-[550px] w-[950px] md:h[400px] md:[w-750px] mx-16  col-span-2">
        <img 
          ref={imageRef}
          src={previousImage} 
          alt="Feature showcase" 
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}
        />
        <img 
          src={activeImage} 
          alt="Feature showcase" 
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
        />
        </div>
       
      </div>
    )
  }