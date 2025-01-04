import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { promises as fs } from 'fs'

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Invalid website ID' }, { status: 400 })
  }

  try {
    const websitesPath = path.join(process.cwd(), 'public', 'data', 'websites.json')
    const websitesData = await fs.readFile(websitesPath, 'utf8')
    const websites = JSON.parse(websitesData)

    const website = websites.find((site: any) => site.id === id)

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 })
    }

    const getImagePath = (imageName: string | null) => {
      if (!imageName) return null
      // Remove any leading slashes and ensure the path starts with '/uploads/'
      const cleanPath = imageName.replace(/^\/?(uploads\/)?/, '')
      return cleanPath ? `/uploads/${cleanPath}` : null
    }

    const imagesPath = getImagePath(website.Images)
    const logoPath = getImagePath(website.Logo)

    return NextResponse.json({
      Images: imagesPath,
      Logo: logoPath
    })
  } catch (error) {
    console.error('Error fetching images:', error)
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
  }
}

