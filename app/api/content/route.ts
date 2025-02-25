import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET() {
  try {
    // Fetch the content from the database
    const content = await prisma.texts.findFirst()
    
    // Return the content or an empty object if none exists
    return NextResponse.json(content || {})
  } catch (error) {
    console.error("Error fetching content:", error)
    
    // Log detailed error information
    if (error instanceof Error) {
      console.error({
        message: error.message,
        stack: error.stack,
      })
    }
    
    // Return a standardized error response
    return NextResponse.json(
      { 
        error: "Failed to fetch content",
        message: error instanceof Error ? error.message : "Unknown error occurred"
      }, 
      { status: 500 }
    )
  }
}
