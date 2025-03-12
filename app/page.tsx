"use client"
import { Suspense, useEffect, useState } from "react"
import { fetchContent } from "@/lib/content-fetch"
import Hero from "@/components/hero"
import Infor from "@/components/info"
import Choose from "@/components/choose"
import Cards from "@/components/service_cards"
import ClientLogos from "@/components/client-logos"
import ContactPage from "@/components/contact-form"
import Loading from "./loading"

export default function Home() {
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
  // console.log(content.clients)

  return (
    <main className="bg-white dark:bg-neutral-900 items-center">
      {/* <Loading/> */}
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

      <div className="bg-white border-4 border-slate-100 pt-12">
        <ContactPage/>
      </div>
    </main>
  )
}

