import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="text-orange-500">Quite Good</span> Privacy Policy
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            How we handle and protect your information at <span className="text-orange-500">Quite Good</span>
          </p>
        </header>

        <ScrollArea className="h-[600px] rounded-md border border-gray-200 shadow-sm">
          <div className="p-6 md:p-8">
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Introduction</h2>
              <Separator className="my-4 bg-gray-200" />
              <p className="text-gray-600 mb-4">
                At <span className="text-orange-500 font-medium">Quite Good</span>, we respect your privacy and are
                committed to protecting your personal data. This privacy policy will inform you about how we look after
                your personal data when you visit our website and tell you about your privacy rights and how the law
                protects you.
              </p>
              <p className="text-gray-600 mb-4">
                <span className="text-orange-500 font-medium">Quite Good</span> provides web solutions, graphic
                designing, social media management, and branding services for businesses of all sizes. This privacy
                policy applies to all personal data we collect through our services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Information We Collect</h2>
              <Separator className="my-4 bg-gray-200" />
              <p className="text-gray-600 mb-4">
                <span className="text-orange-500 font-medium">Quite Good</span> may collect several types of information
                from and about users of our website, including:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Personal identifiers such as name, postal address, email address, telephone number</li>
                <li>Information about your business if you're inquiring about our services</li>
                <li>Records of correspondence if you contact us</li>
                <li>Details of transactions you carry out through our website</li>
                <li>
                  Technical data including IP address, browser type and version, time zone setting, operating system
                </li>
                <li>Usage data about how you use our website and services</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">How We Use Your Information</h2>
              <Separator className="my-4 bg-gray-200" />
              <p className="text-gray-600 mb-4">
                At <span className="text-orange-500 font-medium">Quite Good</span>, we use your personal data for the
                following purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>To provide and maintain our services</li>
                <li>To notify you about changes to our services</li>
                <li>To allow you to participate in interactive features of our services</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our services</li>
                <li>To monitor the usage of our services</li>
                <li>To detect, prevent and address technical issues</li>
                <li>
                  To provide you with news, special offers and general information about other services which we offer
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Data Security</h2>
              <Separator className="my-4 bg-gray-200" />
              <p className="text-gray-600 mb-4">
                <span className="text-orange-500 font-medium">Quite Good</span> has implemented appropriate security
                measures to prevent your personal data from being accidentally lost, used, or accessed in an
                unauthorized way, altered, or disclosed. We limit access to your personal data to those employees,
                agents, contractors, and other third parties who have a business need to know.
              </p>
              <p className="text-gray-600 mb-4">
                We have procedures in place to deal with any suspected personal data breach and will notify you and any
                applicable regulator of a breach where we are legally required to do so.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Rights</h2>
              <Separator className="my-4 bg-gray-200" />
              <p className="text-gray-600 mb-4">
                Under certain circumstances, you have rights under data protection laws in relation to your personal
                data, including the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Request access to your personal data</li>
                <li>Request correction of your personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing your personal data</li>
                <li>Request transfer of your personal data</li>
                <li>Right to withdraw consent</li>
              </ul>
              <p className="text-gray-600 mt-4">
                If you wish to exercise any of these rights, please contact us at
                <span className="text-orange-500 font-medium">hello@quitegood.co</span>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Cookies</h2>
              <Separator className="my-4 bg-gray-200" />
              <p className="text-gray-600 mb-4">
                <span className="text-orange-500 font-medium">Quite Good</span> uses cookies to enhance your experience
                on our website. Cookies are small text files that are placed on your computer by websites that you
                visit. They are widely used to make websites work more efficiently and provide information to the
                website owners.
              </p>
              <p className="text-gray-600 mb-4">
                Most web browsers allow some control of cookies through browser settings. To find out more about
                cookies, including how to see what cookies have been set and how to manage or delete them, visit
                www.aboutcookies.org or www.allaboutcookies.org.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Changes to This Privacy Policy</h2>
              <Separator className="my-4 bg-gray-200" />
              <p className="text-gray-600 mb-4">
                <span className="text-orange-500 font-medium">Quite Good</span> may update our Privacy Policy from time
                to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating
                the "Last Updated" date.
              </p>
              <p className="text-gray-600 mb-4">
                You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy
                Policy are effective when they are posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
              <Separator className="my-4 bg-gray-200" />
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-gray-700">
                  <span className="font-medium text-orange-500">Quite Good</span> Marketing Agency
                </p>
                <p className="text-gray-700">416, Laxmi Tower, Commercial Complex, Azadpur, Delhi - 110033</p>
                <p className="text-gray-700">GST: 07AAQCA9452K1Z1</p>
                <p className="text-gray-700">
                  Email: <span className="text-orange-500">hello@quitegood.co</span>
                </p>
                <p className="text-gray-700">Phone: 9999197095</p>
              </div>
              <p className="text-gray-500 text-sm mt-6">Last Updated: May 9, 2025</p>
            </section>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
