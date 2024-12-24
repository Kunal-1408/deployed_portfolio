import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST handler for updating or creating data
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Check if an ID is provided to determine if it's an update or create
    if (data.id) {
      // Update existing record
      const updatedRecord = await prisma.websites.update({
        where: { id: data.id },
        data: {
          Title: data.Title,
          Status: data.Status,
          Tags: data.Tags,
          Description: data.Description,
          archive: data.archive,
          highlighted:  data.highlighted// Update the specific 'archive' field
        },
      });
      return NextResponse.json(updatedRecord);
    } else {
      // Create new record
      const newRecord = await prisma.websites.create({
        data: {
          Title: data.Title,
          Status: data.Status,
          Tags: data.Tags,
          Description: data.Description,
          archive: data.archive,
          highlighted: data.highlighted // Include this field for the new record
        },
      });
      return NextResponse.json(newRecord, { status: 201 }); // 201 Created
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}