import { fetchContent } from "@/lib/content-fetch";
import ServicePage from "@/components/Servicepages";
import { notFound } from 'next/navigation';

export default async function Design() {
  const content = await fetchContent();

  if (content.error) {
    console.error('Error fetching content:', content.message);
    notFound();
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

