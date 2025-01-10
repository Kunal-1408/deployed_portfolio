import { Suspense } from 'react';
import { fetchContent } from "@/lib/content-fetch";
import Hero from "@/components/hero";
import Infor from "@/components/info";
import Choose from "@/components/choose";
import Cards from "@/components/service_cards";
import ClientLogos from "@/components/client-logos";
import ContactForm from "@/components/contact-form";

export default async function Home() {
  const content = await fetchContent();

  return (
    <main className="bg-white dark:bg-neutral-900 items-center">
      <Hero  />
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
      
      <div className="bg-white border-4 border-slate-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <h1 className="font-bold text-4xl sm:text-5xl text-orange-500 dark:text-neutral-200 mb-4">
              Want better Reach?
            </h1>
            <p className="text-slate-700 text-lg dark:text-neutral-300 mb-8">
              <span className="block">Connect with us!!</span>
              <span className="block">Drop us a line and we&apos;ll get back!!!</span>
            </p>
            <div className="w-full h-64 sm:h-80 lg:h-96">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13997.190483309128!2d77.178936!3d28.7106503!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d0354091c469d%3A0x6f369bf3f44dcee0!2sQuite%20Good%20%7C%20Adsversify%20Marketing%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1729075828599!5m2!1sen!2sin" 
                className="w-full h-full"
                loading="lazy"
                title="Google Maps"
              ></iframe>
            </div>
          </div>
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
    </main>
  );
}

