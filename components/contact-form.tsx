"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const [selectedCountry, setSelectedCountry] = useState("US")

  return (
    <div className="min-h-screen bg-white py-8">
      {/* Main content */}
      <main className="mx-auto grid w-full grid-cols-1 md:grid-cols-2 h-[700px] gap-8 px-20">
        {/* Contact form - LEFT */}
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Get in touch</h1>
            <p className="text-gray-600">
              We're here to help. Chat to our friendly team 24/7 and get set up and ready to go in just 5 minutes.
            </p>
          </div>

          <form className="flex flex-col justify-between flex-grow">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="first-name" className="text-sm font-medium text-gray-700">
                    First name
                  </label>
                  <Input id="first-name" placeholder="First name" className="h-9 rounded-md border-gray-300" />
                </div>
                <div className="space-y-1">
                  <label htmlFor="last-name" className="text-sm font-medium text-gray-700">
                    Last name
                  </label>
                  <Input id="last-name" placeholder="Last name" className="h-9 rounded-md border-gray-300" />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="h-9 rounded-md border-gray-300 bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <div className="flex">
                  <div className="relative inline-flex">
                    <select
                      className="appearance-none h-9 rounded-l-md border border-r-0 border-gray-300 bg-white px-3 py-1 pr-8 text-sm"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                    >
                      <option value="US">IND</option>
                      <option value="UK">UK</option>
                      <option value="CA">CA</option>
                      <option value="AU">AU</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="flex-1 h-9 rounded-r-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  className="min-h-[100px] rounded-md border-gray-300 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Services</label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="website-design" className="mt-0.5" />
                    <label htmlFor="website-design" className="text-sm text-gray-700">
                      Website design
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="content-creation" className="mt-0.5" />
                    <label htmlFor="content-creation" className="text-sm text-gray-700">
                      Content creation
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="ux-design" className="mt-0.5" />
                    <label htmlFor="ux-design" className="text-sm text-gray-700">
                      UX design
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="strategy" className="mt-0.5" />
                    <label htmlFor="strategy" className="text-sm text-gray-700">
                      Strategy & consulting
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="user-research" className="mt-0.5" />
                    <label htmlFor="user-research" className="text-sm text-gray-700">
                      User research
                    </label>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="other" className="mt-0.5" />
                    <label htmlFor="other" className="text-sm text-gray-700">
                      Other
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button className="w-full rounded-md bg-orange-600 py-2 text-white hover:bg-orange-700">
                Send message
              </Button>
            </div>
          </form>
        </div>

        {/* Map - RIGHT */}
        <div className="relative h-full rounded-lg bg-gray-100 overflow-hidden">
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
            className="w-full h-full"
            loading="lazy"
            title="Google Maps"
          ></iframe>
        </div>
      </main>
    </div>
  )
}

