import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const contactUsData = await prisma.contactUs.findFirst()

    if (!contactUsData) {
      return NextResponse.json({ error: "Contact us data not found" }, { status: 404 })
    }

    // Clean up any blob URLs that might have been saved
    const cleanedData = {
      ...contactUsData,
      heroImageUrl: cleanImageUrl(contactUsData.heroImageUrl),
      formImageUrl: cleanImageUrl(contactUsData.formImageUrl),
    }

    return NextResponse.json(cleanedData)
  } catch (error) {
    console.error("Error fetching contact us data:", error)
    return NextResponse.json({ error: "Failed to fetch contact us data" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// Helper function to clean image URLs
function cleanImageUrl(url: string): string {
  if (!url) return ""

  // If it's a blob URL, return empty string to use fallback
  if (url.startsWith("blob:") || url.startsWith("data:")) {
    return ""
  }

  return url
}

