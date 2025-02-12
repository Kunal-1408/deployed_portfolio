"use client"

import React, { useState, useEffect } from "react"
import { Menu, useNavbarBackground, ActiveLogo, Item } from "./ui/navbar-menu"
import { cn } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from 'next/navigation'
import { MenuIcon, X } from 'lucide-react'
import { AnimatePresence } from "framer-motion"
import dynamic from 'next/dynamic'

const ClientSideMenu = dynamic(() => import('./ClientSideMenu'), { ssr: false })

export const Navbarimpli: React.FC = () => {
  const pathname = usePathname()
  const isLandingPage = pathname === '/main' || pathname === '/main/contact'

  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="" isLandingPage={isLandingPage} pathname={pathname} />
    </div>
  )
}

function Navbar({ className, isLandingPage, pathname }: { className?: string; isLandingPage: boolean; pathname: string }) {
  const [active, setActive] = useState<string | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isSolid = useNavbarBackground()
  const isSecond = ActiveLogo()

  const navbarClass = cn(
    "fixed top-0 w-full mx-auto z-50 transition-colors duration-300 flex items-center justify-between px-6",
    className,
    {
      'bg-transparent': !isSolid && (isLandingPage || pathname === '/main/contact'),
      'bg-white shadow-md': isSolid || (!isLandingPage && pathname !== '/main/contact'),
    }
  )

  const logoClass = cn({
    '/Logo-02.png': !isSecond && (isLandingPage || pathname === '/main/contact'),
    '/Logo-01.png': isSecond || (!isLandingPage && pathname !== '/main/contact'),
  })

  const textColorClass = (isLandingPage || pathname === '/main/contact')
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
  const buttonClass1 = cn(
    "px-4 py-2 rounded-md transition-colors duration-300",
    "bg-transparent text-orange-500 border border-orange-500 hover:bg-orange-500 hover:text-white",
  )
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

      <div className="hidden md:flex items-center space-x-2 mr-8">
        <Menu setActive={setActive} isLandingPage={isLandingPage} isSolid={isSolid}>
          <div className="flex space-x-8">
            <Item title="Website Portfolio" href="/main/works/web" isLandingPage={isLandingPage} isSolid={isSolid} />
            <Item title="Branding Portfolio" href="/main/works/brands" isLandingPage={isLandingPage} isSolid={isSolid} />
            {/* <Item title="Design" href="/works/design" isLandingPage={isLandingPage} isSolid={isSolid} /> */}
            <Item title="Social Media Portfolio" href="/main/works/social" isLandingPage={isLandingPage} isSolid={isSolid} />
            <Item title="About" href="/main/AboutUs" isLandingPage={isLandingPage} isSolid={isSolid} />
          </div>
        </Menu>
        <Link href="/contact">
          <button className={buttonClass}>
            Contact Us
          </button>
        </Link>
        <Link href="/contact">
          <button className={buttonClass1}>
            Main Website
          </button>
        </Link>
      </div>

      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 ${textColorClass}`}>
          {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <ClientSideMenu
            isLandingPage={isLandingPage}
            isSolid={isSolid}
            buttonClass={buttonClass}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbarimpli

