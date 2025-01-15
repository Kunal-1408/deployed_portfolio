import { fetchContent } from "@/lib/content-fetch";
import ServicePage from "@/components/Servicepages";
import { notFound } from 'next/navigation';

export default async function Social() {
  const content = await fetchContent();

  if (content.error) {
    console.error('Error fetching content:', content.message);
    notFound();
  }

  const socialData = content.servicePages?.social;

  if (!socialData) {
    console.error('Social media data not found in the content');
    notFound();
  }

  return (
    <ServicePage
      serviceType="seo"
      data={socialData}
    />
  );
}

