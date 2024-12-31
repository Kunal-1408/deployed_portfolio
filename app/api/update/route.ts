import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST handler for updating or creating data
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { type, ...fields } = data; // Extract the type and other fields

    let result;

    switch (type) {
      case 'websites':
        result = await handleWebsites(fields);
        break;
      case 'brand':
        result = await handleBrand(fields);
        break;
      case 'design':
        result = await handleDesign(fields);
        break;
      case 'social':
        result = await handleSocial(fields);
        break;
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json(result, { status: result.id ? 200 : 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

async function handleWebsites(data) {
  if (data.id) {
    return await prisma.websites.update({
      where: { id: data.id },
      data: {
        Title: data.Title,
        Status: data.Status,
        Tags: data.Tags,
        Description: data.Description,
        archive: data.archive,
        highlighted: data.highlighted
      },
    });
  } else {
    return await prisma.websites.create({
      data: {
        Title: data.Title,
        Status: data.Status,
        Tags: data.Tags,
        Description: data.Description,
        archive: data.archive,
        highlighted: data.highlighted
      },
    });
  }
}

async function handleBrand(data) {
  if (data.id) {
    return await prisma.brand.update({
      where: { id: data.id },
      data: {
        Brand: data.Brand,
        Description: data.Description,
        Logo: data.Logo,
        Stats: data.Stats,
        banner: data.banner,
        highlighted: data.highlighted,
        tags: data.tags
      },
    });
  } else {
    return await prisma.brand.create({
      data: {
        Brand: data.Brand,
        Description: data.Description,
        Logo: data.Logo,
        Stats: data.Stats,
        banner: data.banner,
        highlighted: data.highlighted,
        tags: data.tags
      },
    });
  }
}

async function handleDesign(data) {
  if (data.id) {
    return await prisma.design.update({
      where: { id: data.id },
      data: {
        Banner: data.Banner,
        Brands: data.Brands,
        Description: data.Description,
        Logo: data.Logo,
        Type: data.Type,
        highlighted: data.highlighted,
        tags: data.tags
      },
    });
  } else {
    return await prisma.design.create({
      data: {
        Banner: data.Banner,
        Brands: data.Brands,
        Description: data.Description,
        Logo: data.Logo,
        Type: data.Type,
        highlighted: data.highlighted,
        tags: data.tags
      },
    });
  }
}

async function handleSocial(data) {
  if (data.id) {
    return await prisma.social.update({
      where: { id: data.id },
      data: {
        Brand: data.Brand,
        Description: data.Description,
        Logo: data.Logo,
        Stats: data.Stats,
        banner: data.banner,
        highlighted: data.highlighted,
        tags: data.tags
      },
    });
  } else {
    return await prisma.social.create({
      data: {
        Brand: data.Brand,
        Description: data.Description,
        Logo: data.Logo,
        Stats: data.Stats,
        banner: data.banner,
        highlighted: data.highlighted,
        tags: data.tags
      },
    });
  }
}

