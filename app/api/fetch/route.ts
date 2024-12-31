import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search');
  const dataTypes = searchParams.get('types')?.split(',') || ['websites', 'brands', 'designs', 'socials'];

  console.log('API route hit');
  console.log('Search params:', searchParams);
  console.log('Data types:', dataTypes);

  try {
    if (search) {
      const queries = {
        websites: dataTypes.includes('websites') ? prisma.websites.findFirst({ where: { Title: search } }) : null,
        brands: dataTypes.includes('brands') ? prisma.brand.findFirst({ where: { Brand: search } }) : null,
        designs: dataTypes.includes('designs') ? prisma.design.findFirst({ where: { Brands: search } }) : null,
        socials: dataTypes.includes('socials') ? prisma.social.findFirst({ where: { Brand: search } }) : null
      };

      const results = await Promise.all(Object.values(queries));
      const [website, brand, design, social] = results;

      if (!website && !brand && !design && !social) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }

      return NextResponse.json({ website, brand, design, social });
    }

    const fetchQueries = {
      websites: dataTypes.includes('websites') ? {
        data: prisma.websites.findMany({ skip: (currentPage - 1) * itemsPerPage, take: itemsPerPage }),
        total: prisma.websites.count()
      } : null,
      brands: dataTypes.includes('brands') ? {
        data: prisma.brand.findMany({ skip: (currentPage - 1) * itemsPerPage, take: itemsPerPage }),
        total: prisma.brand.count()
      } : null,
      designs: dataTypes.includes('designs') ? {
        data: prisma.design.findMany({ skip: (currentPage - 1) * itemsPerPage, take: itemsPerPage }),
        total: prisma.design.count()
      } : null,
      socials: dataTypes.includes('socials') ? {
        data: prisma.social.findMany({ skip: (currentPage - 1) * itemsPerPage, take: itemsPerPage }),
        total: prisma.social.count()
      } : null
    };

    const results = await Promise.all(
      Object.entries(fetchQueries).flatMap(([key, query]) => 
        query ? [query.data, query.total] : []
      )
    );

    const response = {};
    let index = 0;
    for (const [key, query] of Object.entries(fetchQueries)) {
      if (query) {
        response[key] = {
          data: results[index],
          total: results[index + 1]
        };
        index += 2;
      }
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

