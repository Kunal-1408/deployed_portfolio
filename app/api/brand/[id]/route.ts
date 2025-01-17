import { NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return new NextResponse(JSON.stringify({ error: 'Brand ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const brand = await prisma.brand.findUnique({
      where: {
        id: params.id,
        archive: false, // Only fetch non-archived brands
      },
      select: {
        id: true,
        Brand: true,
        Description: true,
        Logo: true,
        Stats: true,
        banner: true,
        highlighted: true,
        tags: true,
      },
    });

    if (!brand) {
      return new NextResponse(JSON.stringify({ error: 'Brand not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error('Error fetching brand:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

