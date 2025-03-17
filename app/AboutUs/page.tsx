"use client"
import React, { useEffect, useState } from "react";
import { Timeline } from "@/components/ui/timeline";
import { fetchContent } from "@/lib/content-fetch";

export default async function Timelined() {
  const [content, setContent] = useState<any>(null)
  
    useEffect(() => {
      async function loadContent() {
        const fetchedContent = await fetchContent()
        
        setContent(fetchedContent)
      }
      loadContent()
    }, [])
  
    if (!content) {
      return <div>Loading...</div>
    }

  if ('error' in content && content.error) {
    return (
      <div className="w-full p-4">
        <h1 className="text-2xl font-bold">Error loading content</h1>
        <p>{content.message}</p>
      </div>
    );
  }

  console.log(content.aboutUs)

  if (!content.aboutUs || !Array.isArray(content.aboutUs) || content.aboutUs.length === 0) {
    return (
      <div className="w-full p-4">
        <h1 className="text-2xl font-bold">No content available</h1>
        <p>We're sorry, but there's no About Us content available at this time. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Timeline data={content.aboutUs} />
    </div>
  );
}

