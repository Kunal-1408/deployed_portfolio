"use client"
import { fetchContent } from "@/lib/content-fetch";
import ServicePage from "@/components/Servicepages";
import { notFound } from 'next/navigation';
import { useEffect, useState } from "react";

export default async function Web() {
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

  const webDevelopmentData = content.servicePages?.webDevelopment;

  if (!webDevelopmentData) {
    console.error('Web development data not found in the content');
    notFound();
  }

  return (
    <ServicePage
      serviceType="webDevelopment"
      data={webDevelopmentData}
    />
  );
}

