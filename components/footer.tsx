import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa"
import { RotatingText } from "./ui/rotating-text"
import { Button } from "./ui/button"

export const Footer: React.FC = () => {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Footerimpli />
    </div>
  )
}

export const Footerimpli: React.FC = () => {
  return (
    <div className="relative w-full mx-auto justify-between flex-col bg-neutral-100 border-t-2 border-orange-100">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 py-8 mx-auto max-w-6xl">
        <div className="flex flex-col items-center md:items-start">
          {/* <Link href={"https://quitegood.co"}> */}
          <div className="flex flex-col items-center">
          <RotatingText/>
          <Link href={"https://quitegood.co"}>
            <Button className="bg-neutral-400/70 text-white border-neutral-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 mt-5 mx-auto "> Main Website</Button>
          </Link>
          
          </div>
            
            {/* <Image src={"/icon.png"} alt="logo" height={110} width={140} /> */}
          {/* </Link> */}
          
        </div>

        <div className="hidden md:block">
          <h3 className="text-neutral-500 mb-3 mt-2">Quick Links</h3>
          <ul className="list-none text-neutral-400 text-sm space-y-2">
            <li>
              <Link href="/works">Works</Link>
            </li>
            <li>
              <Link href="/agency">Agency</Link>
            </li>
            <li>
              <Link href="/about">About</Link>
            </li>
            <li>
              <Link href="/case-studies">Case Studies</Link>
            </li>
            <li>
              <Link href="/pricing">Pricing</Link>
            </li>
          </ul>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-neutral-500 mb-3 mt-2">Locate Us</h3>
          <div className="text-sm text-neutral-400 flex flex-col md:flex-row md:items-center">
            <span className="md:after:content-['|'] md:after:mx-2">Delhi</span>
            <span className="md:after:content-['|'] md:after:mx-2">Gurugram</span>
            <span>Canada</span>
          </div>
        </div>

        <div className="text-center md:text-left">
          <h3 className="text-neutral-500 mb-3 mt-2">Sitemap</h3>
          <ul className="list-none text-neutral-400 text-sm space-y-2">
            <li>
              <Link href="/terms">Terms of Service</Link>
            </li>
            <li>
              <Link href="/privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>
      </div>

      <hr className="w-64 h-0.5 mx-auto my-4 bg-neutral-300 border-0 rounded dark:bg-gray-700" />

      <div className="flex flex-wrap justify-center pb-4 text-neutral-400 space-x-4">
        <Link href="#">
          <FaFacebook className="h-8 w-8" />
        </Link>
        <Link href="#">
          <FaInstagram className="h-8 w-8" />
        </Link>
        <Link href="#">
          <FaTwitter className="h-8 w-8" />
        </Link>
        <Link href="#">
          <FaLinkedin className="h-8 w-8" />
        </Link>
      </div>

      <div className="flex items-center justify-center py-4 px-4 text-center">
        <span className="text-sm text-slate-400">© 2016-2025 <br />Adsversify Marketing Private ltd.</span>
      </div>
    </div>
  )
}

