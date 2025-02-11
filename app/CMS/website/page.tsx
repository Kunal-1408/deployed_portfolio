"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AdminDashboard() {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    websiteLogo: null,
    footerLogo: null,
    favicon: null,
    contactPage: null,
    loginPage: null,
    signupPage: null,
  })

  const handleFileChange = (name: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [name]: file }))
  }

  return (
    <div className="min-h-screen bg-[#E8EDF2] p-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Logo Upload Sections */}
        <Card className="bg-white">
          <CardHeader className="bg-[#2D3339] text-white p-3">
            <CardTitle className="text-sm font-normal">Website Logo</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <Input type="file" onChange={(e) => handleFileChange("websiteLogo", e.target.files?.[0] || null)} />
            <Button className="bg-[#3B82F6] hover:bg-blue-600">Submit</Button>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="bg-[#2D3339] text-white p-3">
            <CardTitle className="text-sm font-normal">Website Footer Logo</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <Input type="file" onChange={(e) => handleFileChange("footerLogo", e.target.files?.[0] || null)} />
            <Button className="bg-[#3B82F6] hover:bg-blue-600">Submit</Button>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader className="bg-[#2D3339] text-white p-3">
            <CardTitle className="text-sm font-normal">Website Favicon</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <Input type="file" onChange={(e) => handleFileChange("favicon", e.target.files?.[0] || null)} />
            <Button className="bg-[#3B82F6] hover:bg-blue-600">Submit</Button>
          </CardContent>
        </Card>

        {/* SEO Section */}
        <Card className="bg-white row-span-2">
          <CardHeader className="bg-[#2D3339] text-white p-3">
            <CardTitle className="text-sm font-normal">Seo Meta/Keyword</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <Label className="text-xs text-pink-500">Meta Title</Label>
              <Input defaultValue="Aiva Jewellery" />
            </div>
            <div>
              <Label className="text-xs text-pink-500">Meta Keyword</Label>
              <Textarea className="bg-neutral-50" defaultValue="Aiva Jewellery" />
            </div>
            <div>
              <Label className="text-xs text-pink-500">Meta Desc</Label>
              <Textarea className="bg-neutral-50" defaultValue="Aiva Jewellery" />
            </div>
            <Button className="bg-[#3B82F6] hover:bg-blue-600">Submit</Button>
          </CardContent>
        </Card>

        {/* Contact Details Section */}
        <Card className="bg-white col-span-2 row-span-2">
          <CardHeader className="bg-[#2D3339] text-white p-3">
            <CardTitle className="text-sm font-normal">Contact Detail</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone-1</Label>
                <Input defaultValue="9999501429" />
              </div>
              <div>
                <Label>Phone-2</Label>
                <Input defaultValue="9958856353" />
              </div>
              <div>
                <Label>Email-1</Label>
                <Input defaultValue="support@aivajewellery.com" />
              </div>
              <div>
                <Label>Email-2</Label>
                <Input />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Textarea className="min-h-[100px] bg-neutral-50" />
            </div>
            <div>
              <Label>
                Contact Page Image <span className="text-xs text-pink-500">(600 x 472px)</span>
              </Label>
              <Input type="file" onChange={(e) => handleFileChange("contactPage", e.target.files?.[0] || null)} />
            </div>
            <div>
              <Label>
                Login Page Image <span className="text-xs text-pink-500">(600 x 472px)</span>
              </Label>
              <Input type="file" onChange={(e) => handleFileChange("loginPage", e.target.files?.[0] || null)} />
            </div>
            <div>
              <Label>
                Signup Page Image <span className="text-xs text-pink-500">(600 x 472px)</span>
              </Label>
              <Input type="file" onChange={(e) => handleFileChange("signupPage", e.target.files?.[0] || null)} />
            </div>
            <div>
              <Label>Footer Copyright Text</Label>
              <Input defaultValue="Caira Diamonds © 2024. All Rights Reserved" />
            </div>
            <div>
              <Label>Contact Text</Label>
              <Textarea className="bg-neutral-50" defaultValue="We will get back to you!" />
            </div>
            <div>
              <Label>
                Maps <span className="text-xs text-pink-500">[paste code under-{"https://maps"}]</span>
              </Label>
              <Input />
            </div>
            <Button className="bg-[#3B82F6] hover:bg-blue-600">Submit</Button>
          </CardContent>
        </Card>

        {/* Social Links Section */}
        <Card className="bg-white col-span-3">
          <CardHeader className="bg-[#2D3339] text-white p-3">
            <CardTitle className="text-sm font-normal">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-pink-500">Facebook</Label>
                <Input defaultValue="https://www.facebook.com/share/555WtKAqUtgMTake/7msbexdst+QQ84d" />
              </div>
              <div>
                <Label className="text-xs text-pink-500">Instagram</Label>
                <Input defaultValue="https://www.instagram.com/aivajewellery/" />
              </div>
              <div>
                <Label className="text-xs text-pink-500">Skype</Label>
                <Input />
              </div>
              <div>
                <Label className="text-xs text-pink-500">LinkedIn</Label>
                <Input />
              </div>
              <div>
                <Label className="text-xs text-pink-500">Twitter</Label>
                <Input />
              </div>
              <div>
                <Label className="text-xs text-pink-500">YouTube</Label>
                <Input />
              </div>
              <div>
                <Label className="text-xs text-pink-500">WhatsApp</Label>
                <Input defaultValue="9958856353" />
              </div>
            </div>
            <Button className="bg-[#3B82F6] hover:bg-blue-600 mt-4">Submit</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

