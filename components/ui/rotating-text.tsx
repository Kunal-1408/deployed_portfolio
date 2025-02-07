'use client'

import { motion } from "framer-motion"
import Image from 'next/image'

export function RotatingText() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-24 h-24"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            id="textPath"
            d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
            fill="none"
            stroke="none"
          />
          <text className="text-sm font-semibold uppercase">
            <textPath href="#textPath" startOffset="0%">
              Quite Good! •  
            </textPath>
          </text>
          <text className="text-sm font-semibold uppercase">
            <textPath href="#textPath" startOffset="50%">
              Quite Good! •  
            </textPath>
          </text>
        </svg>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/QG.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
      </div>
    </motion.div>
  )
}

