import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

export async function GET() {
  try {
    const content = await prisma.texts.findFirst()
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const updatedContent = await prisma.texts.upsert({
      where: { id: data.id || 'default_id' },
      update: {
        hero: data.hero,
        clients: data.clients,
        servicePages: data.servicePages,
        services: data.services,
        whyChooseUs: data.whyChooseUs,
      },
      create: {
        hero: data.hero,
        clients: data.clients,
        servicePages: data.servicePages,
        services: data.services,
        whyChooseUs: data.whyChooseUs,
      },
    })

    return NextResponse.json({ message: 'Content updated successfully', content: updatedContent })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}