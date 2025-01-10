'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, ChevronDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface ContactUsProps {
  content: {
    banner: {
      imageUrl: string;
      title: string;
      description: string;
    };
    contactForm: {
      title: string;
      description: string;
      imageSrc: string;
    };
    contactInfo: {
      title: string;
      cards: {
        icon: string;
        title: string;
        content: string;
      }[];
    };
    faqs: {
      title: string;
      items: {
        question: string;
        answer: string;
      }[];
      sidebar: {
        title: string;
        content: string;
      };
    };
    mapEmbedUrl: string;
  };
}

export default function ContactUs({ content }: ContactUsProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'MapPin': return <MapPin className="w-8 h-8 text-orange-500 group-hover:text-white" />;
      case 'Phone': return <Phone className="w-8 h-8 text-orange-500 group-hover:text-white" />;
      case 'Mail': return <Mail className="w-8 h-8 text-orange-500 group-hover:text-white" />;
      case 'Clock': return <Clock className="w-8 h-8 text-orange-500 group-hover:text-white" />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <Image
          src={content.banner.imageUrl}
          alt="Contact Us Banner"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-start p-8">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-2">{content.banner.title}</h1>
            <p className="max-w-md text-lg opacity-70">
              {content.banner.description}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">{content.contactForm.title}</h2>
              <p className="mb-8">{content.contactForm.description}</p>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input placeholder="Your Email" type="email" />
                <Input placeholder="Subject" />
                <textarea placeholder="Your Message" className='flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'/>
                <button className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">SUBMIT MESSAGE</button>
              </form>
            </div>
            <div className="hidden md:block">
              <Image
                src={content.contactForm.imageSrc}
                alt="Contact Form Image"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto max-w-6xl px-4 md:px-0">
          <h2 className="text-3xl font-bold mb-12 text-center">{content.contactInfo.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {content.contactInfo.cards.map((item, index) => (
              <Card key={index} className="bg-zinc-900 transition-colors duration-300 hover:bg-orange-500 group">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="text-orange-500 group-hover:text-white transition-colors duration-300">
                    {getIconComponent(item.icon)}
                  </div>
                  <h3 className="text-lg font-semibold mt-4 mb-2 text-white transition-colors duration-300">{item.title}</h3>
                  <p className="text-sm text-white transition-colors duration-300">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12">{content.faqs.title}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              {content.faqs.items.map((item, index) => (
                <div key={index} className="border rounded-md">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left font-medium py-4 px-6 hover:bg-orange-100 transition-colors duration-200"
                  >
                    {item.question}
                    <ChevronDown className={`shrink-0 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 pt-0">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="bg-orange-500 p-8 text-white rounded-lg self-start">
              <h3 className="text-2xl font-bold mb-4">{content.faqs.sidebar.title}</h3>
              <p>{content.faqs.sidebar.content}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] relative overflow-hidden">
        <iframe src={content.mapEmbedUrl} width="1920" height="450" loading="lazy"></iframe>
      </section>
    </div>
  )
}

