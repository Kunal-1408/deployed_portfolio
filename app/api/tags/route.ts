import { NextResponse } from "next/server"
import {prisma} from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const projectType = searchParams.get("projectType")

    let tagTypes

    if (projectType) {
      // Fetch tag types for a specific project type
      tagTypes = await prisma.tagType.findMany({
        where: {
          projectType: {
            name: projectType,
          },
        },
        include: {
          tags: true,
        },
      })
    } else {
      // Fetch all tag types
      tagTypes = await prisma.tagType.findMany({
        include: {
          tags: true,
        },
      })
    }

    // Transform the data to match the expected format in the component
    const formattedTags = tagTypes.map((tagType) => ({
      title: tagType.name,
      tags: tagType.tags.map((tag) => tag.name),
      color: tagType.color,
    }))

    return NextResponse.json({ tags: formattedTags })
  } catch (error) {
    console.error("Error fetching tags:", error)
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 })
  }
}

