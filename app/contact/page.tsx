import ContactUs from '../../components/contact';
import { fetchContent } from '../../lib/content-fetch';

export default async function ContactUsPage() {
  const content = await fetchContent();
  console.log(content.contactUs)
  return <ContactUs content={content.contactUs} />;
}