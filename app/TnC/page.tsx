import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="px-4 py-8 w-full">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-orange-500">Quite Good</span> Private Limited
          </h1>
          <p className="mt-2 text-lg text-gray-600">Terms and Conditions</p>
        </div>

        <div className="mb-8">
          <p className="mb-6 text-gray-600">Last Updated: May 9, 2025</p>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                Welcome to <span className="text-orange-500">Quite Good</span> Private Limited. These Terms and
                Conditions govern your use of our services and website. By engaging our services, you agree to comply
                with and be bound by these terms.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>2. Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">
                <span className="text-orange-500">Quite Good</span> Private Limited provides the following services:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>Web design and development solutions</li>
                <li>Graphic design and visual identity creation</li>
                <li>Social media management and strategy</li>
                <li>Branding and rebranding services</li>
                <li>Digital marketing campaigns</li>
              </ul>
              <p className="mt-4 text-gray-700">
                The specific deliverables, timelines, and costs will be outlined in a separate agreement or statement of
                work.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>3. Payment Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">Unless otherwise specified in writing:</p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>A 50% deposit is required before work begins</li>
                <li>Remaining balance is due upon project completion</li>
                <li>For ongoing services, payment is due within 15 days of invoice</li>
                <li>Late payments will incur a 1.5% monthly interest charge</li>
                <li>All prices are exclusive of applicable taxes</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>4. Intellectual Property Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">
                Upon receipt of full payment, clients will receive ownership of the final deliverables, subject to the
                following conditions:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>
                  <span className="text-orange-500">Quite Good</span> Private Limited retains the right to use the work
                  in portfolios, case studies, and marketing materials
                </li>
                <li>Third-party elements (stock photos, fonts, etc.) remain subject to their original licenses</li>
                <li>
                  Unused concepts and drafts remain the property of <span className="text-orange-500">Quite Good</span>
                </li>
                <li>Source files may be provided at an additional cost</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>5. Confidentiality</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <span className="text-orange-500">Quite Good</span> Private Limited agrees to keep confidential all
                client information not in the public domain. Similarly, clients agree to maintain confidentiality
                regarding our proprietary processes, methodologies, and pricing structures.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>6. Project Timeline and Revisions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">
                Project timelines will be established in the initial agreement. Clients are entitled to:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>Two rounds of revisions for each deliverable</li>
                <li>Additional revisions at an hourly rate</li>
                <li>Timeline extensions may result from client delays in providing feedback or materials</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>7. Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-700">
                Either party may terminate the agreement with 30 days written notice. In the event of termination:
              </p>
              <ul className="ml-6 list-disc space-y-2 text-gray-700">
                <li>Client is responsible for payment for all work completed</li>
                <li>Deposits are non-refundable</li>
                <li>Early termination fees may apply as specified in the service agreement</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>8. Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <span className="text-orange-500">Quite Good</span> Private Limited's liability is limited to the amount
                paid for services. We are not liable for indirect, consequential, or incidental damages arising from our
                services.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>9. Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                These terms are governed by the laws of the jurisdiction where{" "}
                <span className="text-orange-500">Quite Good</span> Private Limited is registered. Any disputes shall be
                resolved through arbitration in said jurisdiction.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6 w-full">
            <CardHeader>
              <CardTitle>10. Amendments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                <span className="text-orange-500">Quite Good</span> Private Limited reserves the right to modify these
                terms at any time. Clients will be notified of significant changes, and continued use of our services
                constitutes acceptance of the updated terms.
              </p>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        <div className="text-center text-gray-600">
          <p>For any questions regarding these terms, please contact us at:</p>
          <p className="mt-2">
            <strong>
              <span className="text-orange-500">Quite Good</span> Private Limited
            </strong>
            <br />
            Address: 416, Laxmi Tower, Commercial Complex, Azadpur, Delhi - 110033
            <br />
            Email: hello@quitegood.co
            <br />
            Phone: 9999197095
          </p>
        </div>
      </div>
    </div>
  )
}
