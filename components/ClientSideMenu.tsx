import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Item } from './ui/navbar-menu'

interface ClientSideMenuProps {
  isLandingPage: boolean
  isSolid: boolean
  buttonClass: string
}

const menuVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
}

const ClientSideMenu: React.FC<ClientSideMenuProps> = ({ isLandingPage, isSolid, buttonClass }) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={menuVariants}
      transition={{ duration: 0.3 }}
      className="absolute top-full left-0 right-0 bg-white shadow-md py-4 px-6 md:hidden"
    >
      <div className="flex flex-col space-y-4">
        <Item title="Website works" href="/works/web" isLandingPage={isLandingPage} isSolid={true} />
        <Item title="Branding works" href="/works/brands" isLandingPage={isLandingPage} isSolid={true} />
        <Item title="Design works" href="/works/design" isLandingPage={isLandingPage} isSolid={true} />
        <Item title="Social Media works" href="/works/social" isLandingPage={isLandingPage} isSolid={true} />
        <Item title="About" href="/AboutUs" isLandingPage={isLandingPage} isSolid={true} />
        <Link href="/contact">
          <button className={`${buttonClass} w-full text-center`}>
            Contact Us
          </button>
        </Link>
      </div>
    </motion.div>
  )
}

export default ClientSideMenu

