"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface ContactUsData {
  heroImageUrl: string
  formImageUrl: string
  contactInfoCards: {
    icon: string
    title: string
    description: string
  }[]
  faqs: {
    question: string
    answer: string
  }[]
}

export default function ContactUs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [content, setContent] = useState<ContactUsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [heroImageError, setHeroImageError] = useState(false)
  const [formImageError, setFormImageError] = useState(false)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch("/api/contact-us")
        if (response.ok) {
          const data = await response.json()
          setContent(data)
        } else {
          console.error("Failed to fetch contact us content")
        }
      } catch (error) {
        console.error("Error fetching contact us content:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  // Fallback data in case the fetch fails
  const fallbackFaqs = [
    {
      question: "WHAT TYPES OF PROJECTS DO YOU HANDLE?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      question: "HOW LONG DOES A TYPICAL PROJECT LAST?",
      answer:
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      question: "DO YOU OFFER FREE CONSULTATIONS?",
      answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    },
    {
      question: "CAN I MAKE CHANGES TO THE PROJECT ONCE IT'S STARTED?",
      answer:
        "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      question: "HOW DO YOU ENSURE PROJECT QUALITY AND SAFETY?",
      answer:
        "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    },
  ]

  // Use content from database or fallback to static content
  const faqItems = content?.faqs && content.faqs.length > 0 ? content.faqs : fallbackFaqs

  // Default contact info cards if none are provided from the database
  const defaultContactCards = [
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>',
      title: "CALL US ON",
      description: "+91-9999197-95",
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
      title: "MAIL ADDRESS",
      description: "hello@quitegood.co",
    },
    {
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
      title: "OPENING TIME",
      description: "Mon - Fri: 10 AM - 6 PM",
    },
  ]

  // Map the database icons to Lucide icons for the contact cards
  const contactCards =
    content?.contactInfoCards && content.contactInfoCards.length > 0 ? content.contactInfoCards : defaultContactCards

  // Helper function to check if a URL is a blob URL
  const isBlobUrl = (url: string) => {
    return url && (url.startsWith("blob:") || url.startsWith("data:"))
  }

  // Get valid image URLs or fallbacks
  const heroImageUrl =
    content?.heroImageUrl && !isBlobUrl(content.heroImageUrl) && !heroImageError ? content.heroImageUrl : "/web.jpg"

  const formImageUrl =
    content?.formImageUrl && !isBlobUrl(content.formImageUrl) && !formImageError ? content.formImageUrl : "/web.jpg"

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] hero-section">
        <Image
          src={heroImageUrl || "/placeholder.svg"}
          alt="Construction worker"
          layout="fill"
          objectFit="cover"
          onError={() => setHeroImageError(true)}
          unoptimized={heroImageUrl.startsWith("https://")}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-start p-8">
          {/* <div className="text-white">
            <h1 className="text-5xl font-bold mb-2">CONTACT US</h1>
            <p className="max-w-md text-lg opacity-70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div> */}
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">REACH US FOR ANY INQUIRIES</h2>
              <p className="mb-8">
                We are here to help with all your marketing needs. Contact us today for quotes, information, or any
                questions you may have.
              </p>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input placeholder="Your Email" type="email" />
                <Input placeholder="Subject" />
                <textarea
                  placeholder="Your Message"
                  className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                  SUBMIT MESSAGE
                </button>
              </form>
            </div>
            <div className="hidden md:block">
              <Image
                src={formImageUrl || "/placeholder.svg"}
                alt="Construction workers"
                width={600}
                height={400}
                className="rounded-lg"
                onError={() => setFormImageError(true)}
                unoptimized={formImageUrl.startsWith("https://")}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-black text-white py-16">
        <div className="container mx-auto max-w-6xl px-4 md:px-0">
          <h2 className="text-3xl font-bold mb-12 text-center">CONTACT US</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {contactCards.map((item, index) => (
              <Card key={index} className="bg-zinc-900 transition-colors duration-300 hover:bg-orange-500 group">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div
                    className="text-orange-500 group-hover:text-white transition-colors duration-300"
                    dangerouslySetInnerHTML={{ __html: item.icon }}
                  ></div>
                  <h3 className="text-lg font-semibold mt-4 mb-2 text-white transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white transition-colors duration-300">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-12">FREQUENTLY ASKED QUESTIONS</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              {faqItems.map((item, index) => (
                <div key={index} className="border rounded-md">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left font-medium py-4 px-6 hover:bg-orange-100 transition-colors duration-200"
                  >
                    {item.question}
                    <ChevronDown
                      className={`shrink-0 transition-transform duration-200 ${openFaq === index ? "rotate-180" : ""}`}
                    />
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
              <h3 className="text-2xl font-bold mb-4">Great Projects Begin Great Questions!</h3>
              <p>
                Dont be shy to provide the answers you need to build with confidence. We are here to help turn your
                business dreams into reality!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="flex flex-col md:flex-row md:items-stretch relative mb-12 mx-12">
        <div className="flex-1 rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 mb-8 md:mb-0 transform hover:-translate-y-1">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 text-center">
            <h3 className="font-semibold text-xl">Delhi </h3>
          </div>
          <div className="h-[250px] md:h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13997.190483309128!2d77.178936!3d28.7106503!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0354091c469d%3A0x6f369bf3f44dcee0!2sQuite%20Good%20%7C%20Adsversify%20Marketing%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1729075828599!5m2!1sen!2sin"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Delhi Office"
            ></iframe>
          </div>
        </div>

        {/* Vertical Ruler 2 */}
        <div className="hidden md:flex flex-col items-center justify-center mx-4">
          <div className="w-[3px] h-[80%] bg-orange-200 rounded-full"></div>
        </div>

        {/* Horizontal divider for mobile */}
        <div className="h-[3px] w-full bg-orange-200 rounded-full md:hidden my-4"></div>
        {/* First Location */}
        <div className="flex-1 rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 mb-8 md:mb-0 transform hover:-translate-y-1">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 text-center">
            <h3 className="font-semibold text-xl">Gurugram </h3>
          </div>
          <div className="h-[250px] md:h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3507.6782728865123!2d77.0796161!3d28.459113299999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1936c0a4d589%3A0x7b9e835659e61f07!2sQuite%20Good%20%7C%20Adsversify%20Marketing%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1741853404250!5m2!1sen!2sin"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Gurugram Office"
            ></iframe>
          </div>
        </div>

        {/* Vertical Ruler 1 */}
        <div className="hidden md:flex flex-col items-center justify-center mx-4">
          <div className="w-[3px] h-[80%] bg-orange-200 rounded-full"></div>
        </div>

        {/* Horizontal divider for mobile */}
        <div className="h-[3px] w-full bg-orange-200 rounded-full md:hidden my-4"></div>

        {/* Third Location */}
        <div className="flex-1 rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-gray-100 text-center">
            <h3 className="font-semibold text-xl">Toronto </h3>
          </div>
          <div className="h-[250px] md:h-[300px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2880.6537675554323!2d-79.3444545!3d43.7800455!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4d3cecc2b3519%3A0xc20d88ffbd49749a!2sAdsversify%20Marketing!5e0!3m2!1sen!2sin!4v1741854078464!5m2!1sen!2sin"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Toronto Office"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  )
}

