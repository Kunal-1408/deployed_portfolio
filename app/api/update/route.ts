import { NextRequest, NextResponse } from 'next/server';
import {prisma} from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  console.log('Update route hit');
  try {
    const formData = await req.formData();
    const type = formData.get('type') as string;
    console.log('Received type:', type);

    if (!type) {
      throw new Error('Type is required');
    }

    const data: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('Tags[') || key === 'Tags') {
        if (!data.Tags) data.Tags = [];
        if (Array.isArray(value)) {
          data.Tags.push(...value);
        } else {
          data.Tags.push(value);
        }
      } else if (value instanceof File) {
        // Handle file upload
        const arrayBuffer = await value.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = value.name;
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);
        data[key] = `/uploads/${filename}`;
      } else if (key !== 'type') {
        if (key.startsWith('Stats.')) {
          const statKey = key.split('.')[1];
          if (!data.Stats) data.Stats = {};
          data.Stats[statKey] = value;
        } else if (value === 'true') {
          data[key] = true;
        } else if (value === 'false') {
          data[key] = false;
        } else {
          data[key] = value;
        }
      }
    }

    console.log('Processed data:', data);

    let result;

    switch (type) {
      case 'websites':
        const existingWebsite = await prisma.websites.findUnique({
          where: { id: data.id },
        });

        if (existingWebsite) {
          result = await prisma.websites.update({
            where: { id: data.id },
            data: {
              Title: data.Title,
              Description: data.Description,
              Status: data.Status,
              URL: data.URL,
              Tags: data.Tags || [],
              Backup_Date: data.Backup_Date,
              Content_Update_Date: data.Content_Update_Date,
              archive: data.archive || false,
              highlighted: data.highlighted || false,
              Images: data.Images,
              Logo: data.Logo,
            },
          });
        } else {
          result = await prisma.websites.create({
            data: {
              Title: data.Title,
              Description: data.Description,
              Status: data.Status,
              URL: data.URL,
              Tags: data.Tags || [],
              Backup_Date: data.Backup_Date,
              Content_Update_Date: data.Content_Update_Date,
              archive: data.archive || false,
              highlighted: data.highlighted || false,
              Images: data.Images,
              Logo: data.Logo,
            },
          });
        }
        break;
      case 'brand':
        const existingBrand = await prisma.brand.findUnique({
          where: { id: data.id },
        });

        if (existingBrand) {
          result = await prisma.brand.update({
            where: { id: data.id },
            data: {
              Brand: data.Brand,
              Description: data.Description,
              Logo: data.Logo,
              Stats: data.Stats ? {
                impression: data.Stats.impression,
                interactions: data.Stats.interactions,
                reach: data.Stats.reach,
              } : undefined,
              banner: data.banner,
              highlighted: data.highlighted,
              tags: data.tags || [],
            },
          });
        } else {
          result = await prisma.brand.create({
            data: {
              Brand: data.Brand,
              Description: data.Description,
              Logo: data.Logo,
              Stats: data.Stats ? {
                impression: data.Stats.impression,
                interactions: data.Stats.interactions,
                reach: data.Stats.reach,
              } : undefined,
              banner: data.banner,
              highlighted: data.highlighted,
              tags: data.tags || [],
            },
          });
        }
        break;
      case 'social':
        const existingSocial = await prisma.social.findUnique({
          where: { id: data.id },
        });

        if (existingSocial) {
          result = await prisma.social.update({
            where: { id: data.id },
            data: {
              Brand: data.Brand,
              Description: data.Description,
              Logo: data.Logo,
              Stats: data.Stats ? {
                impression: data.Stats.impression,
                interactions: data.Stats.interactions,
                reach: data.Stats.reach,
              } : undefined,
              banner: data.banner,
              highlighted: data.highlighted,
              tags: data.tags || [],
            },
          });
        } else {
          result = await prisma.social.create({
            data: {
              Brand: data.Brand,
              Description: data.Description,
              Logo: data.Logo,
              Stats: data.Stats ? {
                impression: data.Stats.impression,
                interactions: data.Stats.interactions,
                reach: data.Stats.reach,
              } : undefined,
              banner: data.banner,
              highlighted: data.highlighted,
              tags: data.tags || [],
            },
          });
        }
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    console.log('Operation result:', result);
    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('Error in POST /api/update:', error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        stack: error instanceof Error && error.stack ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

