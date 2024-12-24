"use client"

import React, { useState } from "react"
import {Menu,  useNavbarBackground, activeLogo, Item } from "./ui/navbar-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from 'next/navigation'

export const Navbarimpli: React.FC = () => {
  const pathname = usePathname()
  const isLandingPage = pathname === '/' || pathname === '/contact'

  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="" isLandingPage={isLandingPage} pathname={pathname} />
    </div>
  )
}

function Navbar({ className, isLandingPage, pathname }: { className?: string; isLandingPage: boolean; pathname: string }) {
  const [active, setActive] = useState<string | null>(null)
  const isSolid = useNavbarBackground()
  const isSecond = activeLogo()

  const navbarClass = cn(
    "fixed top-0 w-full mx-auto z-50 transition-colors duration-300 flex items-center justify-between px-6",
    className,
    {
      'bg-transparent': !isSolid && (isLandingPage || pathname === '/contact'),
      'bg-white shadow-md': isSolid || (!isLandingPage && pathname !== '/contact'),
    }
  )

  const logoClass = cn({
    '/Logo-02.png': !isSecond && (isLandingPage || pathname === '/contact'),
    '/Logo-01.png': isSecond || (!isLandingPage && pathname !== '/contact'),
  })

  const textColorClass = (isLandingPage || pathname === '/contact')
    ? isSolid
      ? 'text-black'
      : 'text-neutral-300'
    : 'text-black'

  const buttonClass = cn(
    "px-4 py-2 rounded-md transition-colors duration-300",
    {
      'bg-transparent text-neutral-300 border border-neutral-300 hover:bg-white hover:text-black': !isSolid && (isLandingPage || pathname === '/contact'),
      'bg-transparent text-black border border-black hover:bg-black hover:text-white': isSolid || (!isLandingPage && pathname !== '/contact'),
    }
  )

  return (
    <div className={navbarClass}>
      <div className="flex-shrink-0 w-48 h-24 flex items-center ml-12">
        <Link href="/">
          <Image 
            src={logoClass} 
            alt="logo" 
            width={4500} 
            height={4500} 
            className="w-auto h-full object-contain"
          />
        </Link>
      </div>

      <div className="flex items-center space-x-2 mr-8">
        <Menu setActive={setActive} isLandingPage={isLandingPage} isSolid={isSolid}>
          <div className="flex space-x-8">
            <Item title="Website works" href="/works/web" isLandingPage={isLandingPage} isSolid={isSolid} />
            <Item title="Branding works" href="/works/brands" isLandingPage={isLandingPage} isSolid={isSolid} />
            <Item title="Design works" href="/works/design" isLandingPage={isLandingPage} isSolid={isSolid} />
            <Item title="Social Media works" href="/" isLandingPage={isLandingPage} isSolid={isSolid} />
            <Item title="About" href="/AboutUs" isLandingPage={isLandingPage} isSolid={isSolid} />
          </div>
        </Menu>
        <Link href="/contact">
          <button className={buttonClass}>
            Contact Us
          </button>
        </Link>
      </div>

    </div>
  )
}

export default Navbarimpli 