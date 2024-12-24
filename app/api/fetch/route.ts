import { NextResponse } from 'next/server'; import { prisma } from '@/lib/prisma'; import { Prisma } from '@prisma/client';

export async function GET(request: Request) { const { searchParams } = new URL(request.url); const currentPage = parseInt(searchParams.get('page') || '1'); const websitesPerPage = parseInt(searchParams.get('limit') || '10'); const search = searchParams.get('search') || '';

try { const searchCondition: Prisma.WebsitesWhereInput = search ? { OR: [ { Title: { contains: search, mode: 'insensitive' } }, { Description: { contains: search, mode: 'insensitive' } }, { Tags: { hasSome: [search] } }, ], } : {};

// Fetch all highlighted websites that match the search
const highlightedWebsites = await prisma.websites.findMany({
  where: {
    highlighted: true,
    ...searchCondition,
  },
});

// Fetch paginated non-highlighted websites that match the search
const nonHighlightedWebsites = await prisma.websites.findMany({
  where: {
    highlighted: false,
    ...searchCondition,
  },
  skip: (currentPage - 1) * websitesPerPage,
  take: websitesPerPage,
});

// Combine highlighted and non-highlighted websites
const websites = [...highlightedWebsites, ...nonHighlightedWebsites];

const total = await prisma.websites.count({
  where: searchCondition,
});

return NextResponse.json({ websites, total, highlightedCount: highlightedWebsites.length });
} catch (error) { console.error('Error fetching websites:', error); return NextResponse.json({ error: 'Something went wrong' }, { status: 500 }); } }