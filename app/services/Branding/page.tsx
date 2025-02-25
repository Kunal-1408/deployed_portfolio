import { fetchContent } from "@/lib/content-fetch";
import ServicePage from "@/components/Servicepages";
import { notFound } from 'next/navigation';

export default async function Branding() {
  const content = await fetchContent();

  if (content.error) {
    console.error('Error fetching content:', content.message);
    notFound();
  }

  const brandingData = content.servicePages?.branding;

  if (!brandingData) {
    console.error('Branding data not found in the content');
    notFound();
  }

  return (
    <ServicePage
      serviceType="branding"
      data={brandingData}
    />
  );
}

