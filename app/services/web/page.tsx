import { fetchContent } from "@/lib/content-fetch";
import ServicePage from "@/components/Servicepages";

export default async function Web() {
  const content = await fetchContent();
  return (
    <ServicePage
      serviceType="webDevelopment"
      data={content.servicePages.webDevelopment}
    />
  );
  
}