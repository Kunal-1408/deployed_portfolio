import { fetchContent } from "@/lib/content-fetch";
import ServicePage from "@/components/Servicepages";
import { notFound } from 'next/navigation';

export default async function Web() {
  const content = await fetchContent();

  if (content.error) {
    console.error('Error fetching content:', content.message);
    notFound(); // This will render the closest error.tsx or not-found.tsx file
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

