'use client'

import { Marquee } from "@/components/ui/marquee";

interface ClientLogosProps {
  content: Array<{ src: string; alt: string }>;
}

export default function ClientLogos({ content }: ClientLogosProps) {
  return <Marquee logos={content} />;
}

