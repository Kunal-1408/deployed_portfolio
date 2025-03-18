import type React from "react"
import Link from "next/link"
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa"
import { RotatingText } from "./ui/rotating-text"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Phone, Mail } from "lucide-react"

export const Footerimpli: React.FC = () => {
  return (
    <div className="relative w-full mx-auto bg-white border-t border-gray-200 py-4">
      <div className="max-w-6xl mx-auto px-3">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Logo and social icons column */}
          <div className="flex flex-col items-center md:items-start">
            {/* <Link href={"https://quitegood.co"}> */}
            <div className="flex flex-col items-center">
              <RotatingText />
              <Link href={"https://quitegood.co"}>
                <Button className="bg-neutral-400/70 text-white border-neutral-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 mt-3 mx-auto text-sm py-1 h-8">
                  {" "}
                  Main Website
                </Button>
              </Link>
            </div>

            {/* <Image src={"/icon.png"} alt="logo" height={110} width={140} /> */}
            {/* </Link> */}
          </div>

          {/* Middle columns with links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:pr-6">
            {/* Account section */}
            <div>
              <h3 className="text-base font-medium mb-2">QUICK LINKS</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-orange-500">
                    Works
                  </Link>
                </li>
                <li>
                  <Link href="/About" className="text-gray-600 hover:text-orange-500">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/Privacy" className="text-gray-600 hover:text-orange-500">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick links section */}
            <div>
              <h3 className="text-base font-medium mb-2">CONTACT</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <p className="text-gray-600 ">
                    Phone: <br /> <span className="hover:text-orange-500">+91 9999197095</span> 
                  </p>
                </li>
                <li>
                  <Link href="mailto:hello@quitegood.co" className="text-gray-600 ">
                    E-Mail:<span className="hover:text-orange-500"> hello@quitegood.co</span>
                  </Link>
                </li>
                {/* <li>
                  <Link href="/pricing" className="text-gray-600 hover:text-orange-500">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-orange-500">
                    Terms of Service
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>

          {/* Contact us column */}
          <div className="bg-white border border-orange-200 rounded-lg shadow-md p-2 md:ml-4">
            <h3 className="text-base font-medium mb-2 text-orange-600">REQUEST A CALLBACK</h3>
            <div className="space-y-3 text-gray-600">
              <form action="">
                <div className="space-y-2 mb-2">
                  <div className="space-y-1">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Name *
                    </label>
                    <Input
                      id="name"
                      placeholder="Name"
                      className="h-8 rounded-md border-orange-200 text-sm bg-white focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone Number"
                      className="h-8 rounded-md border-orange-200 text-sm bg-white focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>

                  {/* <div className="space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Query *
                    </label>
                    <Textarea
                      id="email"
  
                      placeholder="Email"
                      className="h-20 rounded-md border-orange-200 text-sm bg-white focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div> */}
                  <div>
                    <Button className="w-full rounded-md bg-orange-600 py-1 text-white hover:bg-orange-700 text-sm h-8">
                      Submit
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="text-center ">
          <p className="text-gray-400 text-xs">Delhi | Gurugram | Canada</p>
        </div>
        <hr className="w-48 h-0.5 mx-auto my-2 bg-neutral-300 border-0 rounded dark:bg-gray-700" />

        {/* Bottom navigation */}
        <div className="pt-2">
          <div className="flex flex-wrap justify-center pb-2 text-neutral-400 space-x-3">
            <Link href="#">
              <FaFacebook className="h-6 w-6" />
            </Link>
            <Link href="#">
              <FaInstagram className="h-6 w-6" />
            </Link>
            <Link href="#">
              <FaTwitter className="h-6 w-6" />
            </Link>
            <Link href="#">
              <FaLinkedin className="h-6 w-6" />
            </Link>
          </div>

          <div className="text-center mt-2">
            <span className="text-xs text-slate-400">
              © 2016-2025 <br />
              Adsversify Marketing Private Limited
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

