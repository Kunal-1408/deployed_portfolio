import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const type = searchParams.get('type') || 'websites'; // 'websites', 'brands', 'designs', or 'socials'

  try {
    let model;
    switch (type) {
      case 'websites':
        model = prisma.websites;
        break;
      case 'brands':
        model = prisma.brand;
        break;
      case 'designs':
        model = prisma.design;
        break;
      case 'socials':
        model = prisma.brand; // Assuming social uses the same model as brand
        break;
      default:
        throw new Error('Invalid type');
    }

    const searchCondition: any = search
      ? {
          OR: [
            { Title: { contains: search, mode: 'insensitive' } },
            { Description: { contains: search, mode: 'insensitive' } },
            { Tags: { hasSome: [search] } },
          ],
        }
      : {};

    // Fetch all highlighted items that match the search
    const highlightedItems = await model.findMany({
      where: {
        highlighted: true,
        ...searchCondition,
      },
    });

    // Fetch paginated non-highlighted items that match the search
    const nonHighlightedItems = await model.findMany({
      where: {
        highlighted: false,
        ...searchCondition,
      },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    });

    // Combine highlighted and non-highlighted items
    const items = [...highlightedItems, ...nonHighlightedItems];

    const total = await model.count({
      where: searchCondition,
    });

    return NextResponse.json({ 
      items, 
      total, 
      highlightedCount: highlightedItems.length 
    });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}