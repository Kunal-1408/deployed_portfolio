"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const transition = {
  type: "spring",
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

export const useNavbarBackground = () => {
  const [isSolid, setIsSolid] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroSectionHeight = window.innerHeight;

      if (window.scrollY > heroSectionHeight) {
        setIsSolid(true);
      } else {
        setIsSolid(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isSolid;
};
export const activeLogo = ()=>{
  const [isSecond, setSecond]= useState(false);

  useEffect(()=>{

    const handleLogo = () =>{
      const height = window.innerHeight;
      if(window.scrollY > height){
        setSecond(true);
      }else{
        setSecond(false);
      }
    };

    window.addEventListener('scroll', handleLogo);
    return ()=>{
      window.removeEventListener('scroll', handleLogo);
    };
  },[]);
  return isSecond;
}

export const MenuItem = ({
  setActive,
  active,
  item,
  children,
  isLandingPage,
  isSolid,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
  isLandingPage: boolean;
  isSolid: boolean;
}) => {
  const textColorClass = isLandingPage
    ? isSolid
      ? 'text-black'
      : 'text-neutral-300'
    : 'text-black';

    return (
      <div onMouseEnter={() => setActive(item)} className="relative ">
        <motion.p
          transition={{ duration: 0.3 }}
          className={`font-semibold text-md cursor-pointer hover:opacity-[0.9] ${textColorClass}`} 
        >
          {item}
        </motion.p>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={transition}
          >
            {active === item && (
              <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
                <motion.div
                  transition={transition}
                  layoutId="active" // layoutId ensures smooth animation
                  className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
                >
                  <motion.div
                    layout // layout ensures smooth animation
                    className="w-max h-full p-4"
                  >
                    {children}
                  </motion.div>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    );
};

export const Menu = ({
  setActive,
  children,
  isLandingPage,
  isSolid,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  isLandingPage: boolean;
  isSolid: boolean;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={`relative border border-transparent ${
        isLandingPage && !isSolid ? 'dark:bg-transparent' : 'dark:bg-black'
      } dark:border-white/[0.2] shadow-input flex justify-center space-x-4 px-8 py-6`}
    >
      {children}
    </nav>
  );
};

export const ProductItem = ({
  title,
  description,
  href,
  src,
}: {
  title: string;
  description: string;
  href: string;
  src: string;
}) => {
  return (
    <Link href={href} className="flex space-x-2">
      <Image
        src={src}
        width={140}
        height={70}
        alt={title}
        className="flex-shrink-0 rounded-md shadow-2xl"
      />
      <div>
        <h4 className="text-xl font-bold mb-1 text-black dark:text-white">
          {title}
        </h4>
        <p className="text-neutral-700 text-sm max-w-[10rem] dark:text-neutral-300">
          {description}
        </p>
      </div>
    </Link>
  );
};

export const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black  "
    >
      {children}
    </Link>
  );
};

export const Item = ({
  title,
  href,
  isLandingPage,
  isSolid,
}: {
  title: string;
  href: string;
  isLandingPage: boolean;
  isSolid: boolean;
}) => {
  const textColor = isLandingPage
    ? isSolid
      ? 'text-black'
      : 'text-neutral-300'
    : 'text-black';

  return (
    <Link
      href={href}
      scroll={false}
      className={`font-semibold text-md cursor-pointer hover:opacity-[0.9] ${textColor}`}
    >
      {title}
    </Link>
  );
};