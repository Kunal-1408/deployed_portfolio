"use client"
import { fetchContent } from "@/lib/content-fetch";
import ServicePage from "@/components/Servicepages";
import { notFound } from 'next/navigation';
import { useState, useEffect } from "react";

export default async function Design() {
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

  const designData = content.servicePages?.design;

  if (!designData) {
    console.error('Design data not found in the content');
    notFound();
  }

  return (
    <ServicePage
      serviceType="design"
      data={designData}
    />
  );
}

