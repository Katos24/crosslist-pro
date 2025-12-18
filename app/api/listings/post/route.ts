import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postToEbay } from '@/lib/services/ebay';

export async function POST(request: Request) {
  try {
    const { listingId } = await request.json();

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: true }
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (!listing.user.ebayToken) {
      return NextResponse.json({ 
        error: 'eBay not connected. Please connect your eBay account first.' 
      }, { status: 400 });
    }

    const results: any = {
      success: true,
      platforms: {}
    };

    // Post to eBay with user token
    try {
      console.log('📦 Posting to eBay...');
      const ebayResult = await postToEbay({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category || '99',
        condition: listing.condition || 'USED_GOOD',
        images: listing.images,
        quantity: 1
      }, listing.user.ebayToken);

      await prisma.listing.update({
        where: { id: listingId },
        data: {
          ebayId: ebayResult.ebayId,
          ebayStatus: 'active',
          ebayUrl: ebayResult.ebayUrl
        }
      });

      results.platforms.ebay = { 
        success: true, 
        url: ebayResult.ebayUrl 
      };
      
    } catch (error: any) {
      console.error('❌ eBay error:', error);
      results.platforms.ebay = { success: false, error: error.message };
    }

    // Facebook note
    results.platforms.facebook = { 
      success: false, 
      message: 'Facebook posting works on local machine only' 
    };

    return NextResponse.json(results);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
