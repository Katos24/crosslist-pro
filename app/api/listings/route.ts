import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { title, description, price, category, condition, images, userId } = await request.json();

    if (!title || !description || !price || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        category,
        condition,
        images: images || [],
        userId
      }
    });

    return NextResponse.json(
      { message: 'Listing created', listing },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create listing error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const listings = await prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ listings }, { status: 200 });
  } catch (error) {
    console.error('Get listings error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
