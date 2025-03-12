import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa"
import { RotatingText } from "./ui/rotating-text"
import { Button } from "./ui/button"
export const Footerimpli: React.FC = () => {
  return (
    <div className="relative w-full mx-auto bg-white border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-12">
          {/* Logo and social icons column */}
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-6">
              <RotatingText />
            </div>
            <div className="flex space-x-2 mt-4">
              <Link href="#" className="bg-orange-500 p-2 text-white hover:bg-orange-800 transition">
                <FaFacebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="bg-orange-500 p-2 text-white hover:bg-orange-800 transition">
                <FaInstagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="bg-orange-500 p-2 text-white hover:bg-orange-800 transition">
                <FaTwitter className="h-5 w-5" />
              </Link>
            </div>
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
          <div>
            <h3 className="text-lg font-medium mb-6">CONTACT US</h3>
            <div className="space-y-3 text-gray-600">
              <p>
                <span className="font-medium">Phone:</span> 099991 97095
              </p>
              <p>
                <span className="font-medium">Email:</span>
              </p>
              <Link href="https://quitegood.co" className="inline-block mt-2">
                <Button className="bg-neutral-400/70 text-white border-neutral-600 hover:bg-orange-500 hover:text-white hover:border-orange-500">
                  Main Website
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="text-center ">
          <p className="text-gray-400">Delhi, Gurugram, Canada</p>
        </div>

        {/* Bottom navigation */}
        <div className="pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-center space-x-4 text-gray-600">
            <Link href="#" className="hover:text-orange-500">
              Home
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="#" className="hover:text-orange-500">
              About Us
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="#" className="hover:text-orange-500">
              Blogs
            </Link>
            <span className="text-gray-300">|</span>
            <Link href="#" className="hover:text-orange-500">
              Contact Us
            </Link>
          </div>

          <div className="text-center mt-6">
            <span className="text-sm text-slate-400">
              © 2016-2025 <br />
              Adsversify Marketing Private limited
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
