'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, ChevronDown } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactUs() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqItems = [
    { question: "WHAT TYPES OF PROJECTS DO YOU HANDLE?", answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." },
    { question: "HOW LONG DOES A TYPICAL PROJECT LAST?", answer: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat." },
    { question: "DO YOU OFFER FREE CONSULTATIONS?", answer: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur." },
    { question: "CAN I MAKE CHANGES TO THE PROJECT ONCE IT'S STARTED?", answer: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." },
    { question: "HOW DO YOU ENSURE PROJECT QUALITY AND SAFETY?", answer: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt." },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <Image
          src="/web.jpg"
          alt="Construction worker"
          layout="fill"
          objectFit="cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-start p-8">
          <div className="text-white">
            <h1 className="text-5xl font-bold mb-2">CONTACT US</h1>
            <p className="max-w-md text-lg opacity-70">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 px-4 md:px-0">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-6">REACH US FOR ANY INQUIRIES</h2>
              <p className="mb-8">We are here to help with all your marketing needs. Contact us today for quotes, information, or any questions you may have.</p>
              <form className="space-y-4">
                <Input placeholder="Your Name" />
                <Input placeholder="Your Email" type="email" />
                <Input placeholder="Subject" />
                <textarea placeholder="Your Message"  className='flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'/>
                <button className="w-full h-10 bg-orange-500 hover:bg-orange-600 text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">SUBMIT MESSAGE</button>
              </form>
            </div>
            <div className="hidden md:block">
              <Image
                src="/web.jpg"
                alt="Construction workers"
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
          <h2 className="text-3xl font-bold mb-12 text-center">CONTACT & JOIN TOGETHER</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <MapPin className="w-8 h-8 text-orange-500  group-hover:text-white" />, title: "VISIT LOCATION", content: "123 Construction Ave, Building City, 12345" },
              { icon: <Phone className="w-8 h-8 text-orange-500 group-hover:text-white" />, title: "CALL US ON", content: "+1 (123) 456-7890" },
              { icon: <Mail className="w-8 h-8 text-orange-500 group-hover:text-white" />, title: "MAIL ADDRESS", content: "info@buildco.com" },
              { icon: <Clock className="w-8 h-8 text-orange-500 group-hover:text-white" />, title: "OPENING TIME", content: "Mon - Fri: 8AM - 5PM" },
            ].map((item, index) => (
              <Card key={index} className="bg-zinc-900 transition-colors duration-300 hover:bg-orange-500 group">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="text-orange-500  group-hover:text-white transition-colors duration-300">{item.icon}</div>
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
              <h3 className="text-2xl font-bold mb-4">Great Projects Begin Great Questions!</h3>
              <p>Dont be shy to provide the answers you need to build with confidence. We are here to help turn your construction dreams into reality!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="h-[400px] relative overflow-hidden">
      <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13997.190483309128!2d77.178936!3d28.7106503!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0354091c469d%3A0x6f369bf3f44dcee0!2sQuite%20Good%20%7C%20Adsversify%20Marketing%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1729075828599!5m2!1sen!2sin" width="1920" height="450"  loading="lazy" ></iframe>
      </section>
    </div>
  )
}