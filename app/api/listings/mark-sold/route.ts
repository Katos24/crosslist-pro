import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { listingId } = await request.json();

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 });
    }

    // Update listing as sold
    const listing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        soldAt: new Date(),
        ebayStatus: 'sold',
        fbStatus: 'sold'
      }
    });

    // TODO: Actually delist from eBay and Facebook here
    // For now, just marking as sold in database

    return NextResponse.json({ 
      message: 'Marked as sold',
      listing 
    }, { status: 200 });
  } catch (error) {
    console.error('Mark sold error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
