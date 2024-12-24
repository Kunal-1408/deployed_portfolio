import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (id) {
    // Fetch individual brand
    try {
      const brand = await prisma.design.findUnique({
        where: {
          id: id,
        }
      });

      if (!brand) {
        return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
      }

      return NextResponse.json(brand);
    } catch (error) {
      console.error('Error fetching brand:', error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  } else {
    // Fetch all brands with pagination and search
    const currentPage = parseInt(searchParams.get('page') || '1');
    const brandsPerPage = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    try {
      const searchCondition: Prisma.designWhereInput = search
        ? {
            OR: [
              { Brands: { contains: search, mode: 'insensitive' } },
              { Description: { contains: search, mode: 'insensitive' } },
              { tags: { hasSome: [search] } },
            ],
          }
        : {};

      const brands = await prisma.design.findMany({
        where: searchCondition,
        skip: (currentPage - 1) * brandsPerPage,
        take: brandsPerPage,
      });

      const total = await prisma.design.count({
        where: searchCondition,
      });

      return NextResponse.json({ brands, total });
    } catch (error) {
      console.error('Error fetching brands:', error);
      return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
    }
  }
}