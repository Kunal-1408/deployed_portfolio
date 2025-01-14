"use client"
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from 'lucide-react';

interface ServicePageProps {
  serviceType: 'branding' | 'design' | 'seo' | 'webDevelopment';
  data: {
    carouselImages: { imageUrl: string }[];
    description: string;
    whatWeDo: {
      cards: { title: string; description: string }[];
      description: string;
    };
  };
}

export default function ServicePage({ serviceType, data }: ServicePageProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentProject, setCurrentProject] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const images = data.carouselImages.map(img => img.imageUrl);
  const services = data.whatWeDo.cards;

  // Placeholder projects (you might want to fetch these from somewhere else)
  const projects = [
    { title: "Project 1", Image: "/website.png", src: "#" },
    { title: "Project 2", Image: "/website.png", src: "#" },
    { title: "Project 3", Image: "/website.png", src: "#" },
    { title: "Project 4", Image: "/website.png", src: "#" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentProject((prev) => (prev < projects.length - 2 ? prev + 2 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 px-4 md:px-6 lg:px-8">
        <div className="max-w-full mx-auto py-10 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 mb-8 ml-20 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-16">
              {capitalizeFirstLetter(serviceType)} <span className="text-orange-400">SERVICES</span>
            </h1>
            <p className="text-lg text-gray-600">{data.description}</p>
          </div>
          <div className="w-1/2 relative overflow-hidden rounded-lg mx-10 py-12">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentImage * 100}%)` }}
            >
              {images.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Carousel image ${index + 1}`}
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
          <p className="text-left ml-20 mb-12 max-w-3xl">{data.whatWeDo.description}</p>
          <div className="grid grid-cols-3 lg:grid-cols-3 mx-auto mb-8 max-w-[1200px]">
            {services.slice(0, 3).map((service, index) => (
              <Card
                key={index}
                className={`transition-all duration-500 hover:bg-orange-400 group h-[450px] w-[350px] ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold group-hover:text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm group-hover:text-white">{service.description}</p>
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
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${(index + 3) * 100}ms` }}
                >
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold group-hover:text-white">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm group-hover:text-white">{service.description}</p>
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
      <section className="py-12 px-4 md:px-6 lg:px-8 ">
        <div className="max-w-full mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold ml-20">VIEW RELATED PROJECTS</h2>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-full flex items-center">
              View More
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
          <div className="relative max-w-5xl mx-auto h-fit overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentProject * 50}%)` }}
            >
              {projects.map((project, index) => (
                <div key={index} className="w-1/2 flex-shrink-0 px-2 h-full">
                  <Card 
                    key={index} 
                    className={`overflow-hidden h-[450px] transition-all duration-300 w-full min-w-[250px] relative group ${
                      hoveredIndex === null || hoveredIndex === index
                        ? "hover:shadow-xl scale-100 "
                        : "scale-95 blur-[1px]"
                    }`}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-all duration-300"
                      style={{ backgroundImage: `url(${project.Image})` }}
                    ></div>
                    <div className="relative z-10 bg-black bg-opacity-50 h-full transition-all duration-300 group-hover:bg-opacity-30">
                      <CardHeader className="p-8">
                        <CardTitle className="text-3xl font-bold text-white">{project.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="absolute bottom-0 flex flex-col items-center">
                        <button className="bg-orange-400/60 text-base text-white font-semibold h-12 px-6 py-2 border hover:bg-orange-500/60 rounded-lg mt-4">
                          Explore
                        </button>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
            <button
              onClick={() => setCurrentProject((prev) => (prev > 0 ? prev - 2 : projects.length - 2))}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              aria-label="Previous projects"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => setCurrentProject((prev) => (prev < projects.length - 2 ? prev + 2 : 0))}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
              aria-label="Next projects"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

