import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Determine the project type
    const projectType = data.type;

    if (!projectType || (projectType !== 'brands' && projectType !== 'designs')) {
      return NextResponse.json({ error: 'Invalid project type' }, { status: 400 });
    }

    // Define the common fields
    const commonFields = {
      Banner: data.Banner,
      Description: data.Description,
      Logo: data.Logo,
      highlighted: data.highlighted,
      tags: data.tags,
    };

    // Add type-specific fields
    const typeSpecificFields = projectType === 'brands'
      ? { Brand: data.Brand }
      : { Brands: data.Brands, Type: data.Type };

    // Combine common and type-specific fields
    const recordData = { ...commonFields, ...typeSpecificFields };

    if (data.id) {
      // Update existing record
      const updatedRecord = await prisma[projectType].update({
        where: { id: data.id },
        data: recordData,
      });
      return NextResponse.json(updatedRecord);
    } else {
      // Create new record
      const newRecord = await prisma[projectType].create({
        data: recordData,
      });
      return NextResponse.json(newRecord, { status: 201 }); // 201 Created
    }
  } catch (error) {
    console.error('Error in update route:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}