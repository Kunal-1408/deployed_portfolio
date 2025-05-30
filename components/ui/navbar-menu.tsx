"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
}

export const useNavbarBackground = () => {
  const [isSolid, setIsSolid] = useState(false)

  useEffect(() => {
    // Function to get the hero section height
    const getHeroSectionHeight = () => {
      // Look for an element with the hero-section class
      const heroSection = document.querySelector(".hero-section")

      // If hero section exists, use its height, otherwise fallback to viewport height
      return heroSection ? heroSection.getBoundingClientRect().height : window.innerHeight
    }

    const handleScroll = () => {
      const heroHeight = getHeroSectionHeight()

      if (window.scrollY > heroHeight - 100) {
        // subtract navbar height or use a small offset
        setIsSolid(true)
      } else {
        setIsSolid(false)
      }
    }

    // Initial check
    handleScroll()

    window.addEventListener("scroll", handleScroll)

    // Also listen for resize events in case the hero height changes
    window.addEventListener("resize", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  return isSolid
}

export const ActiveLogo = () => {
  const [isSecond, setSecond] = useState(false)

  useEffect(() => {
    // Function to get the hero section height
    const getHeroSectionHeight = () => {
      // Look for an element with the hero-section class
      const heroSection = document.querySelector(".hero-section")

      // If hero section exists, use its height, otherwise fallback to viewport height
      return heroSection ? heroSection.getBoundingClientRect().height : window.innerHeight
    }

    const handleLogo = () => {
      const heroHeight = getHeroSectionHeight()

      if (window.scrollY > heroHeight - 100) {
        // subtract navbar height or use a small offset
        setSecond(true)
      } else {
        setSecond(false)
      }
    }

    // Initial check
    handleLogo()

    window.addEventListener("scroll", handleLogo)

    // Also listen for resize events in case the hero height changes
    window.addEventListener("resize", handleLogo)

    return () => {
      window.removeEventListener("scroll", handleLogo)
      window.removeEventListener("resize", handleLogo)
    }
  }, [])

  return isSecond
}

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  isLandingPage,
  isSolid,
}: {
  setActive: (item: string) => void
  active: string | null
  item: string
  children?: React.ReactNode
  isLandingPage: boolean
  isSolid: boolean
}) => {
  const textColorClass = isLandingPage ? (isSolid ? "text-black" : "text-neutral-300") : "text-black"

  return (
    <div onMouseEnter={() => setActive(item)} className="relative ">
      <motion.p
        transition={{ duration: 0.3 }}
        className={`font-semibold text-md cursor-pointer hover:opacity-[0.9] ${textColorClass}`}
      >
        {item}
      </motion.p>
      <AnimatePresence>
        {active === item && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={transition}
            className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4"
          >
            <motion.div
              transition={transition}
              layoutId="active"
              className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
            >
              <motion.div layout className="w-max h-full p-4">
                {children}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const Menu = ({
  setActive,
  children,
  isLandingPage,
  isSolid,
}: {
  setActive: (item: string | null) => void
  children: React.ReactNode
  isLandingPage: boolean
  isSolid: boolean
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={`relative border border-transparent ${
        isLandingPage && !isSolid ? "dark:bg-transparent" : "dark:bg-black"
      } dark:border-white/[0.2] shadow-input flex justify-center space-x-4 px-8 py-6`}
    >
      {children}
    </nav>
  )
}

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string
  description: string
  href: string
  src: string
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image
        src={src || "/placeholder.svg"}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">{title}</h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">{description}</p>
      </div>
    </Link>
  )
}

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link {...rest} className="text-neutral-700 dark:text-neutral-200 hover:text-black">
      {children}
    </Link>
  )
}

export const Item = ({
  title,
  href,
  isLandingPage,
  isSolid,
}: {
  title: string
  href: string
  isLandingPage: boolean
  isSolid: boolean
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const textColor = isLandingPage ? (isSolid ? "text-black" : "text-neutral-300") : "text-black"

  if (!isMounted) {
    return (
      <Link
        href={href}
        scroll={false}
        className={`font-semibold text-md cursor-pointer hover:opacity-[0.9] ${textColor}`}
      >
        {title}
      </Link>
    )
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Link
        href={href}
        scroll={false}
        className={`font-semibold text-md cursor-pointer hover:opacity-[0.9] ${textColor}`}
      >
        {title}
      </Link>
    </motion.div>
  )
}

