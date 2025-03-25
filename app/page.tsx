"use client"
import { Suspense, useEffect, useState } from "react"
import { fetchContent } from "@/lib/content-fetch"
import Hero from "@/components/hero"
import Infor from "@/components/info"
import Choose from "@/components/choose"
import Cards from "@/components/service_cards"
import ClientLogos from "@/components/client-logos"

import AnimatedLoader from "@/components/animated-loader"

export default function Home() {
  const [showLoader, setShowLoader] = useState(true)
  const [content, setContent] = useState<any>(null)

  useEffect(() => {
    async function loadContent() {
      const fetchedContent = await fetchContent()
      
      setContent(fetchedContent)
    }
    loadContent()
  }, [])

  if (!content) {
    return <div>Loading...</div>
  }
  

  return (
    <main className="bg-white dark:bg-neutral-900 items-center">

      {/* <Loading/> */}

      {/* {showLoader && (
        <AnimatedLoader
          duration={3000} // Duration for the animation
          autoRemove={true}
          onComplete={() => {
            console.log("Loader animation complete, removing loader")
            setShowLoader(false)
          }}
        />
      )} */}
      <Hero />
      <Infor hero={content.hero} />

      <h1 className="text-slate-900 font-bold text-5xl ml-28">Why Choose us?</h1>
      <div className="pt-8 flex flex-col items-center">
        <Choose whyChooseUs={content.whyChooseUs} />
      </div>

      <div className="flex flex-col bg ml-16 pt-20">
        <h2 className="text-slate-900 font-bold text-5xl pb-2">Solutions</h2>
        <h3 className="text-slate-900 text-3xl">
          Others are okay but we are <span className="text-orange-400 font-bold">Quite Good</span>
        </h3>
      </div>
      <Cards services={content.services} />

      <div className="flex flex-col bg ml-16 mt-16 pb-6">
        <h2 className="text-slate-900 font-extrabold text-5xl">Our Clients</h2>
      </div>
      <div className="w-full pb-12 pt-4">
        <Suspense fallback={<div>Loading clients...</div>}>
          <ClientLogos content={content.clients} />
        </Suspense>
      </div>

      {/* <div className="bg-white border-4 border-slate-100 pt-12">
        <ContactPage/>
      </div> */}
      <h2 className="text-5xl font-bold ml-16 mb-4 ">
        Locate <span className="text-orange-500">Us!</span>
      </h2>
    <div className="w-full mx-auto px-16 py-8">
    
    <div className="flex flex-col md:flex-row md:items-stretch relative mb-12">
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
          {/* <div className="p-5 border-t border-gray-100">
            <div className="flex items-start mb-3">
              <MapPin className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Quite Good | Adsversify Marketing Pvt. Ltd.
                  <br />
                  Plot No. 123, Sector 44
                  <br />
                  Gurugram, Haryana 122003
                  <br />
                  India
                </p>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="ml-3 text-sm text-gray-600">+91 124 456 7890</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="ml-3 text-sm text-gray-600">gurugram@adsversify.com</span>
            </div>
          </div> */}
        </div>

        {/* Vertical Ruler 1 */}
        <div className="hidden md:flex flex-col items-center justify-center mx-4">
          <div className="w-[3px] h-[80%] bg-orange-200 rounded-full"></div>
        </div>

        {/* Horizontal divider for mobile */}
        <div className="h-[3px] w-full bg-orange-200 rounded-full md:hidden my-4"></div>

        {/* Second Location */}
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
          {/* <div className="p-5 border-t border-gray-100">
            <div className="flex items-start mb-3">
              <MapPin className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Quite Good | Adsversify Marketing Pvt. Ltd.
                  <br />
                  A-45, Mohan Cooperative Industrial Estate
                  <br />
                  New Delhi, Delhi 110044
                  <br />
                  India
                </p>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="ml-3 text-sm text-gray-600">+91 11 4567 8901</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="ml-3 text-sm text-gray-600">delhi@adsversify.com</span>
            </div>
          </div> */}
        </div>

        {/* Vertical Ruler 2 */}
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
          {/* <div className="p-5 border-t border-gray-100">
            <div className="flex items-start mb-3">
              <MapPin className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="ml-3">
                <p className="text-sm text-gray-700">
                  Adsversify Marketing
                  <br />
                  120 Eglinton Avenue East, Suite 800
                  <br />
                  Toronto, ON M4P 1E2
                  <br />
                  Canada
                </p>
              </div>
            </div>
            <div className="flex items-center mb-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span className="ml-3 text-sm text-gray-600">+1 (416) 555-7890</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-500" />
              <span className="ml-3 text-sm text-gray-600">toronto@adsversify.com</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>

    </main>
  )
}

