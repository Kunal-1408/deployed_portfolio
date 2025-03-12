import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa"
import { RotatingText } from "./ui/rotating-text"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
export const Footerimpli: React.FC = () => {
  return (
    <div className="relative w-full mx-auto bg-white border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-12">
          {/* Logo and social icons column */}
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

          {/* Middle columns with links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Account section */}
            <div>
              <h3 className="text-lg font-medium mb-6">ACCOUNT</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/works" className="text-gray-600 hover:text-orange-500">
                    Works
                  </Link>
                </li>
                <li>
                  <Link href="/agency" className="text-gray-600 hover:text-orange-500">
                    Agency
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-orange-500">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick links section */}
            <div>
              <h3 className="text-lg font-medium mb-6">QUICK LINKS</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-orange-500">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/case-studies" className="text-gray-600 hover:text-orange-500">
                    Case Studies
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="text-gray-600 hover:text-orange-500">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-orange-500">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact us column */}
          <div className="bg-neutral-50">
            <h3 className="text-lg font-medium mb-6">REQUEST A CALLBACK</h3>
            <div className="space-y-3 text-gray-600">
              <form action="">
              <div className="space-y-6 mb-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-base font-medium text-gray-700">
                  Name *
                </label>
                <Input id="name" placeholder="Name" className="h-12 rounded-md border-gray-300 text-base bg-neutral-100" />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-base font-medium text-gray-700">
                  Phone Number *
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  className="h-12 rounded-md border-gray-300 text-base bg-neutral-100"
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
                  className="h-12 rounded-md border-gray-300 text-base bg-neutral-100"
                />
              </div>
              <div>
              <Button className="w-full rounded-md bg-orange-600 py-2 text-white hover:bg-orange-700 text-base">
                Submit
              </Button>
            </div>
              </div>
              </form>
            </div>
          </div>
        </div>
        <div className="text-center ">
          <p className="text-gray-400">Delhi | Gurugram | Canada</p>
        </div>
        <hr className="w-64 h-0.5 mx-auto my-4 bg-neutral-300 border-0 rounded dark:bg-gray-700" />

        {/* Bottom navigation */}
        <div className="pt-8">
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

          <div className="text-center mt-6">
            <span className="text-sm text-slate-400">
              © 2016-2025 <br />
              Adsversify Marketing Private ltd.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
