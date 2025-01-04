import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    const website = await prisma.websites.findUnique({
      where: { id },
      select: {
        Images: true,
        Logo: true,
      },
    });

    if (!website) {
      return NextResponse.json({ error: 'Website not found' }, { status: 404 });
    }

    // Transform the paths to include the full public URL
    const response = {
      Images: website.Images ? `/uploads/${website.Images}` : null,
      Logo: website.Logo ? `/uploads/${website.Logo}` : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

