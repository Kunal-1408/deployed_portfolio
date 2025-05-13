"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface AnimatedLoaderProps {
  duration?: number
  autoRemove?: boolean
  onComplete?: () => void
}

export default function AnimatedLoader({ duration = 2000, autoRemove = true, onComplete }: AnimatedLoaderProps) {
  // States to track animation phases
  const [isVisible, setIsVisible] = useState(true)
  const [logoVisible, setLogoVisible] = useState(false)
  const [svgAnimationStarted, setSvgAnimationStarted] = useState(false)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)

  // Refs to track and clear timeouts
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  // Function to safely add timeouts that will be cleaned up
  const safeSetTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay)
    timeoutsRef.current.push(timeout)
    return timeout
  }

  // Clear all timeouts
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  // Animation sequence
  useEffect(() => {
    // First, show the logo
    safeSetTimeout(() => {
      setLogoVisible(true)

      // After logo appears, start SVG animation
      safeSetTimeout(() => {
        setSvgAnimationStarted(true)
      }, 1000) // Delay before starting SVG animation
    }, 100) // Short delay before starting the sequence

    return clearAllTimeouts
  }, [])

  // Set a fallback to ensure animation completes
  useEffect(() => {
    if (svgAnimationStarted) {
      const fallbackTimeout = safeSetTimeout(() => {
        if (!isAnimationComplete) {
          console.log("Using fallback for animation completion")
          setIsAnimationComplete(true)
        }
      }, duration)

      return () => clearTimeout(fallbackTimeout)
    }
  }, [svgAnimationStarted, isAnimationComplete, duration])

  // Handle animation completion
  useEffect(() => {
    if (isAnimationComplete) {
      // Allow a brief moment for exit animations to start
      safeSetTimeout(() => {
        console.log("Setting isVisible to false to trigger exit animations")
        setIsVisible(false)
      }, 200) // Increased from 100 to 200ms for more stability
    }
  }, [isAnimationComplete])

  // Clean up all timeouts when component unmounts
  useEffect(() => {
    return clearAllTimeouts
  }, [])

  const paths = [
    "M281.73,394.22c-2.78,0-5.53.37-8.26,1.02-19.6,4.77-37.7,25.52-51.38,43.93,3.9-9.89,7.79-20.38,7.79-25.18,0-6.96-2.73-11.59-6.92-14.47-4.29-2.97-10.11-4.12-16.15-4.12-9.74,0-24.94,4.75-34.7,11.76,3.65,2.68,7.72,4.53,12.25,5.58,6.92-3.39,16.05-5.65,22.45-5.65,2,0,4.65.27,6.89,1.12,2.51.9,4.48,2.51,4.48,5.19,0,3.39-5.02,17-12.3,35.02-6.79,16.9-15.54,37.7-23.96,57.57l-11.37,26.96c-11.1,26.67-18.29,44.05-21.89,53.33-.29,1.22-.58,2.41-.58,3,0,2.12,2.39,5.11,5.7,5.11s4.48-1.8,5.38-3.6c7.79-19.17,18.29-43.74,26.67-64.73l.9-2.09c1.51,11.98,18.29,13.78,27.57,13.78,20.09,0,46.76-9.28,67.72-34.75,18.29-22.77,26.37-50.65,26.37-71.33,0-17.97-5.09-37.45-26.67-37.45ZM273.32,495.79c-17.97,22.19-42.25,30.27-59.03,30.27-2.39,0-15.88-.29-15.88-3.9,0-3.29-2.39-5.99-5.7-5.99-1.19,0-1.8.29-2.7.61,10.96-23.43,27.32-51.65,44.3-73.74,13.47-17.51,27.32-31.2,39.16-35.63,2.65-.97,5.21-1.51,7.65-1.51,12.3,0,15.59,11.08,15.59,24.57,0,19.17-7.18,45.86-23.38,65.31Z",
    "M281.11,565.92c0-20.38,13.18-50.64,38.65-67.42,1.5-.6,3-1.5,3.9-1.5,3.3,0,5.99,3,5.99,5.69,0,1.8-.9,3.59-2.7,5.09-21.58,14.38-34.16,40.75-34.16,58.13,0,8.09,3.6,15.58,11.09,15.58,9.29,0,19.48-8.39,26.07-14.68-5.99-5.69-9.59-15.28-9.59-26.67,0-15.28,9.89-45.55,28.47-45.55,12.59,0,15.28,14.68,15.28,23.37,0,16.78-7.19,31.46-15.58,44.35h.9c8.99,0,19.48-7.19,33.26-23.07,1.2-1.2,3-1.8,4.49-1.8,3.9,0,5.39,3.3,5.39,5.99,0,1.5-.6,3-1.5,3.9-12.59,14.08-26.37,26.67-41.95,26.67-3.3,0-5.99-.3-8.69-1.2-9.89,10.79-22.77,20.38-36.56,20.38-15.88,0-22.77-14.08-22.77-27.27ZM332.05,540.15c0,4.49.9,12.88,5.39,17.38,7.79-11.39,14.98-26.37,14.98-39.25,0-3.6-.3-11.99-3.6-11.99-9.89,0-16.78,22.48-16.78,33.86Z",
    "M409.66,579.11c0-9.59,9.29-25.17,14.98-34.46,.3-.6,7.79-13.48,11.09-19.78,.9-2.1,1.8-4.2,1.8-5.99,0-.6-.3-.9-2.1-.9h-6.29c-3.9,0-7.49-.6-9.89-3.9-7.79,9.59-18.28,22.47-28.17,33.26-.9,1.2-2.7,1.8-4.2,1.8-3.9,0-5.69-2.7-5.69-5.69,0-1.2.3-2.4,1.2-3.6,8.99-10.19,22.47-26.07,30.56-35.96,7.49-9.29,8.09-10.49,9.29-11.69s3.6-2.7,5.1-2.7c4.19,0,5.99,3,5.99,5.39,0,1.5-.6,3.59-1.8,5.39-2.1,3.3-2.7,5.39-2.1,5.99.6.6,4.49,0,7.79,0,6.89,0,11.99,5.1,11.99,11.39,0,8.39-8.99,23.37-15.58,34.76-5.69,9.59-12.29,20.38-12.29,26.67,0,1.8,1.2,2.7,2.7,2.7.6,0,1.8-.3,2.7-.9,10.49-7.79,21.57-19.48,30.86-29.67,4.19-4.49,7.79-8.69,11.09-11.99,.9-.9,2.7-1.8,4.19-1.8,2.7,0,5.99,3,5.99,5.69,0,1.5-.9,3.3-1.8,4.19l-4.49,4.79c-10.49,11.39-26.67,29.96-39.25,38.66-2.7,1.8-5.99,2.7-9.29,2.7-8.39,0-14.38-6.59-14.38-14.38Z",
    "M466.89,543.45c0-1.5.6-3,1.8-4.19,10.19-10.79,17.08-20.38,23.07-30.27h-11.09c-3.3,0-5.99-2.7-5.99-5.99s2.7-5.69,5.99-5.69h17.38l4.5-9.59c11.69-29.37,16.18-38.96,16.18-38.96,.9-2.1,3-3.59,5.39-3.59,3.9,0,5.69,3,5.69,5.69,0,.6,0,2.1-.6,3.59l-17.98,42.85h27.57c3.3,0,5.99,2.4,5.99,5.69s-2.7,5.99-5.99,5.99h-32.06c-6.89,17.68-16.48,45.25-16.48,60.53,0,4.79,1.2,11.99,5.99,11.99,7.79,0,29.97-23.37,46.75-42.25,1.2-1.2,2.7-1.8,4.2-1.8,3.3,0,5.99,3,5.99,5.69,0,1.2-.9,3.3-1.8,4.19-10.49,12.59-38.96,45.85-55.14,45.85-12.28,0-17.38-11.99-17.38-23.37,0-7.79,1.5-17.98,4.79-29.67l-6.59,7.19c-1.2,1.2-2.7,1.8-4.19,1.8-3.6,0-5.99-2.7-5.99-5.69Z",
    "M501.34,666.3c0-19.48,15.88-56.33,36.26-102.48l1.8-3.9c1.8-4.19,2.4-6.29,4.5-10.49-1.5-1.2-3.3-3-3.3-5.09,0-1.2.9-3,1.5-3.9,3.3-3.9,7.79-8.09,11.09-11.99l2.1-5.1,2.7-6.59c7.19-16.78,13.48-31.76,22.17-53.94,7.79-19.48,14.98-36.86,20.98-49.74,5.69-12.59,15.58-17.98,23.67-17.98,12.59,0,18.58,9.59,18.58,20.07,0,14.68-12.29,35.66-28.47,56.94-17.08,22.77-38.36,46.45-52.14,62.93-6.29,14.38-10.79,23.97-17.08,38.66.9-.3,1.2,0,2.1,0,2.4,0,4.5.3,6.59.3h4.19c4.5,0,7.19-.6,10.79-2.1,11.39-5.09,23.37-18.28,35.96-32.66,1.2-1.2,2.7-1.8,4.5-1.8,3.9,0,5.39,3.3,5.39,5.99,0,1.2-.9,3-1.5,3.9-16.78,18.88-27.27,29.97-39.56,35.06-5.69,2.4-11.38,3.3-17.68,3.3-1.8,0-3.3-.3-4.79-.3h-3c0,4.19.6,8.99,1.2,13.19l.6,5.09c1.5,9.89,3.3,22.47,3.3,34.76-.3,30.86-17.38,47.35-32.66,47.35-13.19,0-19.78-8.99-19.78-19.48ZM520.82,674.09c8.39,0,20.98-9.89,21.27-35.96,0-11.09-1.5-22.47-3-32.66l-1.8-12.59c-14.08,32.06-24.27,59.03-24.27,73.41,0,5.99,3.9,7.79,7.79,7.79ZM611.31,418.19c-5.69,12.59-12.88,29.96-20.38,48.84l-13.48,33.86c8.09-9.89,17.98-22.77,25.77-33.26,13.48-18.28,24.27-35.96,27.57-47.05,.3-1.5,.9-3.9,.9-4.5,0-4.49-2.1-9.29-6.89-9.29-4.49,0-9.59,3.59-13.48,11.39Z",
    "M599.33,565.92c0-20.38,13.18-50.64,38.65-67.42,1.5-.6,3-1.5,3.9-1.5,3.3,0,5.99,3,5.99,5.69,0,1.8-.9,3.59-2.7,5.09-21.57,14.38-34.16,40.75-34.16,58.13,0,8.09,3.6,15.58,11.09,15.58,9.29,0,19.48-8.39,26.07-14.68-5.99-5.69-9.59-15.28-9.59-26.67,0-15.28,9.89-45.55,28.47-45.55,12.59,0,15.28,14.68,15.28,23.37,0,16.78-7.19,31.46-15.58,44.35h.9c8.99,0,19.48-7.19,33.26-23.07,1.2-1.2,3-1.8,4.49-1.8,3.9,0,5.39,3.3,5.39,5.99,0,1.5-.6,3-1.5,3.9-12.59,14.08-26.37,26.67-41.95,26.67-3.3,0-5.99-.3-8.69-1.2-9.89,10.79-22.77,20.38-36.56,20.38-15.88,0-22.77-14.08-22.77-27.27ZM650.27,540.15c0,4.49.9,12.88,5.39,17.38,7.79-11.39,14.98-26.37,14.98-39.25,0-3.6-.3-11.99-3.6-11.99-9.89,0-16.78,22.48-16.78,33.86Z",
    "M704.8,573.11c0-8.99,1.5-17.68,3.9-25.47-.9.9-2.4,1.2-3.6,1.2-3.59,0-5.99-2.7-5.99-5.69,0-1.5.6-3,1.5-3.9,2.7-2.7,9.59-10.79,18.88-22.77,23.67-62.93,37.46-88.1,41.35-95.59,11.69-21.27,21.58-25.47,27.87-25.47,8.99,0,12.59,8.09,12.59,15.28,0,4.19-.9,8.99-3.3,13.48-11.39,23.37-44.95,69.22-68.02,98.28-5.39,14.08-13.48,36.26-13.48,50.34,0,4.79.3,8.69,5.09,8.69,5.99,0,20.68-16.18,32.66-29.67,4.49-4.79,8.39-9.29,11.69-12.59,1.2-1.2,2.7-2.1,4.49-2.1,3.9,0,5.69,3.3,5.69,5.99,0,1.5-.9,3.3-1.8,4.19-3,3-6.59,7.19-10.79,11.99-13.19,14.98-30.26,34.16-42.85,34.16-11.69,0-15.88-11.09-15.88-20.38ZM771.02,426.58c-9.29,16.18-17.98,37.76-25.47,56.34,17.68-23.97,34.76-49.14,41.95-63.83,1.5-3,2.1-6.29,2.1-8.39,0-1.8-.3-3.6-1.2-3.6-3,0-8.99,4.79-17.38,19.48Z",
    "M767.72,579.11c0-9.59,5.09-23.37,10.49-35.66-1.8,2.1-2.7,2.7-3.9,3.9-1.2,1.2-2.4,1.8-3.9,1.8-3.3,0-5.69-3.3-5.69-5.99,0-1.8,0-2.4,2.1-4.79l33.86-39.55c1.2-1.2,2.7-2.4,4.5-2.4,3.9,0,5.69,2.1,5.69,4.79,0,.9,0,3-.6,4.19-1.8,3-10.79,18.88-18.88,36.56-5.39,12.59-11.99,26.97-11.99,36.26,0,2.4,0,3.9,1.2,3.9,1.5,0,5.09-1.5,7.79-3.9,17.98-16.48,34.46-35.06,38.06-38.95,1.2-1.2,2.7-1.8,4.49-1.8,3.9,0,5.69,3.3,5.69,5.69,0,1.2-1.2,3.3-2.1,4.5-2.7,3-16.48,18.88-38.36,38.95-5.09,4.79-11.39,7.19-15.88,7.19-9.29,0-12.59-7.79-12.59-14.68ZM822.85,478.42c-5.69,0-7.79-4.19-7.79-8.99,0-5.99,4.5-10.79,9.89-10.79,5.69,0,8.09,4.49,8.09,8.69,0,8.99-6.29,11.09-10.19,11.09Z",
    "M820.45,565.92c0-20.38,13.18-50.64,38.65-67.42,1.5-.6,3-1.5,3.9-1.5,3.3,0,5.99,3,5.99,5.69,0,1.8-.9,3.59-2.7,5.09-21.58,14.38-34.16,40.75-34.16,58.13,0,8.09,3.6,15.58,11.09,15.58,9.29,0,19.48-8.39,26.07-14.68-5.99-5.69-9.59-15.28-9.59-26.67,0-15.28,9.89-45.55,28.47-45.55,12.59,0,15.28,14.68,15.28,23.37,0,16.78-7.19,31.46-15.58,44.35h.9c8.99,0,19.48-7.19,33.26-23.07,1.2-1.2,3-1.8,4.49-1.8,3.9,0,5.39,3.3,5.39,5.99,0,1.5-.6,3-1.5,3.9-12.59,14.08-26.37,26.67-41.95,26.67-3.3,0-5.99-.3-8.69-1.2-9.89,10.79-22.77,20.38-36.56,20.38-15.88,0-22.77-14.08-22.77-27.27ZM871.39,540.15c0,4.49.9,12.88,5.39,17.38,7.79-11.39,14.98-26.37,14.98-39.25,0-3.6-.3-11.99-3.6-11.99-9.89,0-16.78,22.48-16.78,33.86Z",
  ]

  // Animation variants for drawing the path
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: 1.5,
          ease: [0.43, 0.13, 0.23, 0.96],
          delay: i * 0.05, // Stagger the animations
        },
        opacity: { duration: 0.2, delay: i * 0.05 },
      },
    }),
  }

  // Logo animation variants
  const logoVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      scale: 2.0, // Increased from 1.2 to 2.0 for a more dramatic zoom
      transition: {
        duration: 0.5, // Reduced from 0.8 to 0.5 for faster animation
        ease: "easeInOut",
      },
    },
  }

  // SVG container animation variants
  const svgContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5, // Reduced from 0.8 to 0.5 for faster animation
        ease: "easeInOut",
      },
    },
  }

  // Main container animation variants
  const containerVariants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3, // Reduced from 0.5 to 0.3 for faster animation
        ease: "easeInOut",
        delay: 0.5, // Reduced from 0.8 to 0.5 for faster overall sequence
      },
    },
  }

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        console.log("AnimatePresence exit complete")
        clearAllTimeouts()
        // Add a longer delay before calling onComplete to ensure DOM is fully settled
        setTimeout(() => {
          if (onComplete) {
            console.log("Calling onComplete after ensuring DOM is settled")
            onComplete()
          }
        }, 300) // Increased delay to 300ms
      }}
    >
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 bg-white backdrop-blur-sm"
          initial="initial"
          exit="exit"
          variants={containerVariants}
          key="loader-container"
          style={{ position: "fixed", pointerEvents: "none" }}
        >
          {/* Positioning container with relative positioning */}
          <div className="relative">
            {/* SVG Animation - positioned underneath and offset to the right */}
            <motion.div
              className="absolute top-0 left-0 transform translate-x-64 translate-y-0 scale-[1.5] z-10"
              variants={svgContainerVariants}
              initial="hidden"
              animate={svgAnimationStarted ? "visible" : "hidden"}
              exit="exit"
            >
              <motion.svg
                width="100%"
                height="100%"
                viewBox="0 0 1200 800"
                className="w-full max-w-md h-auto"
                onAnimationComplete={() => {
                  console.log("SVG animation complete")
                  setIsAnimationComplete(true)
                }}
              >
                <title>Portfolio</title>
                {paths.map((path, index) => (
                  <motion.path
                    key={index}
                    d={path}
                    fill="none"
                    strokeWidth="8"
                    stroke="#f97316" // Orange color
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial="hidden"
                    animate={svgAnimationStarted ? "visible" : "hidden"}
                    custom={index}
                    variants={draw}
                  />
                ))}
              </motion.svg>
            </motion.div>

            {/* Logo - positioned on top with higher z-index */}
            <motion.div
              className="relative z-0"
              variants={logoVariants}
              initial="hidden"
              animate={logoVisible ? "visible" : "hidden"}
              exit="exit"
            >
              <Image src="/Logo (1).png" width={400} height={100} alt="Quite Good Logo" priority />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
