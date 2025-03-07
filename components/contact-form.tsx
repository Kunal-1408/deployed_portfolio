"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const [selectedCountry, setSelectedCountry] = useState("US")

  return (
    <div className="min-h-screen bg-white py-12">
      {/* Main content */}
      <main className="mx-auto grid w-11/12 max-w-7xl grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 px-4 md:px-8">
        {/* Contact form - LEFT */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">Get in touch</h1>
            <p className="text-gray-600 text-lg">
              We're here to help. Chat to our friendly team 24/7 and get set up and ready to go in just 5 minutes.
            </p>
          </div>

          <form className="flex flex-col flex-grow">
            <div className="space-y-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-base font-medium text-gray-700">
                  Name *
                </label>
                <Input id="name" placeholder="Name" className="h-12 rounded-md border-gray-300 text-base" />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-base font-medium text-gray-700">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  className="h-12 rounded-md border-gray-300 text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-base font-medium text-gray-700">
                  Email *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="h-12 rounded-md border-gray-300 text-base"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="project" className="text-base font-medium text-gray-700">
                  Describe Your Project *
                </label>
                <Textarea
                  id="project"
                  placeholder="Describe Your Project"
                  className="min-h-[150px] rounded-md border-gray-300 text-base py-3"
                />
              </div>
            </div>

            <div>
              <Button className="w-full rounded-md bg-orange-600 py-6 text-white hover:bg-orange-700 text-base">
                Submit
              </Button>
            </div>
          </form>
        </div>

        {/* Map - RIGHT */}
        <div className="relative rounded-lg bg-gray-100 overflow-hidden aspect-square md:aspect-auto">
          <div className="absolute top-3 left-3 z-10 flex space-x-1 rounded-md bg-white shadow-sm">
            <button className="px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">Map</button>
            <button className="px-4 py-1 text-sm font-medium text-gray-500 hover:bg-gray-50">Satellite</button>
          </div>
          <div className="absolute right-3 top-3 z-10 flex flex-col space-y-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-sm text-gray-700 hover:bg-gray-50">
              +
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-sm text-gray-700 hover:bg-gray-50">
              −
            </button>
            <button className="mt-2 flex h-8 w-8 items-center justify-center rounded-md bg-white shadow-sm text-gray-700 hover:bg-gray-50">
              <span className="transform rotate-45">⊥</span>
            </button>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13997.190483309128!2d77.178936!3d28.7106503!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0354091c469d%3A0x6f369bf3f44dcee0!2sQuite%20Good%20%7C%20Adsversify%20Marketing%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1729075828599!5m2!1sen!2sin"
            className="w-full h-full min-h-[600px]"
            loading="lazy"
            title="Google Maps"
          ></iframe>
        </div>
      </main>
    </div>
  )
}

