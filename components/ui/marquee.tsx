"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export const Marquee = ({
  logos,
  direction,
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  logos: {
    src: string;
    alt: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const containerRef1 = React.useRef<HTMLDivElement>(null);
  const scrollerRef1 = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
    addAnimation1();
  }, []);

  const [start, setStart] = useState(false);
  const [starter, setStarter] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getSpeed();
      setStart(true);
    }
  }

  function addAnimation1() {
    if (containerRef1.current && scrollerRef1.current) {
      const scrollerContent = Array.from(scrollerRef1.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef1.current) {
          scrollerRef1.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStarter(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div className="flex flex-col w-full overflow-hidden">
      <div
        ref={containerRef}
        className={cn(
          "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
          className
        )}
      >
        <ul
          ref={scrollerRef}
          className={cn(
            "flex min-w-full shrink-0 py-4 w-max flex-nowrap",
            start && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]",
            direction === "left" ? "animate-scroll-left" : "animate-scroll-right"
          )}
        >
          {logos.map((item, idx) => (
            <li
              className="w-[200px] h-[100px] max-w-full relative flex-shrink-0 md:w-[250px] md:h-[125px] overflow-hidden"
              key={idx}
            >
              <Image 
                src={item.src} 
                alt={item.alt} 
                fill={true} 
                className=" transition-all duration-300 object-cover"
              />
            </li>
          ))}
        </ul>
      </div> 
      <div
        ref={containerRef1}
        className={cn(
          "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
          className
        )}
      >
        <ul
          ref={scrollerRef1}
          className={cn(
            "flex min-w-full shrink-0  w-max flex-nowrap",
            starter && "animate-scroll",
            pauseOnHover && "hover:[animation-play-state:paused]",
            direction === "left" ? "animate-scroll-right" : "animate-scroll-left",
            speed==="slow"
          )}
        >
          {logos.map((item, idx) => (
            <li
              className="w-[200px] h-[100px] max-w-full relative flex-shrink-0 md:w-[250px] md:h-[125px] overflow-hidden"
              key={idx}
            >
              <Image 
                src={item.src} 
                alt={item.alt} 
                fill={true} 
                className=" transition-all duration-300 object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};