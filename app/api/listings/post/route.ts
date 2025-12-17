import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postToFacebookMarketplace } from '@/lib/services/facebook';
import { postToEbay } from '@/lib/services/ebay';

export async function POST(request: Request) {
  try {
    const { listingId } = await request.json();

    if (!listingId) {
      return NextResponse.json({ error: 'Listing ID required' }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const results: any = {
      success: true,
      platforms: {}
    };

    // Post to eBay
    try {
      console.log('📦 Attempting eBay post...');
      const ebayResult = await postToEbay({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category || 'Other',
        condition: listing.condition || 'used',
        images: listing.images,
        quantity: 1
      });

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
        url: ebayResult.ebayUrl,
        message: ebayResult.message 
      };
      
    } catch (error: any) {
      console.error('❌ eBay error:', error);
      results.platforms.ebay = { success: false, error: error.message };
    }

    // Post to Facebook
    try {
      console.log('📘 Attempting Facebook post...');
      const fbResult = await postToFacebookMarketplace({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        category: listing.category || 'Other',
        condition: listing.condition || 'used',
        images: listing.images
      });

      await prisma.listing.update({
        where: { id: listingId },
        data: {
          fbStatus: 'active',
          fbUrl: fbResult.url
        }
      });

      results.platforms.facebook = { success: true, url: fbResult.url };
      
    } catch (error: any) {
      console.error('❌ Facebook error:', error);
      results.platforms.facebook = { success: false, error: error.message };
    }

    return NextResponse.json(results);

  } catch (error: any) {
    console.error('❌ Post error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
