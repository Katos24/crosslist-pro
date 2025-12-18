import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { listingId } = await request.json();

    // Get listing from database
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Get user's eBay tokens
    const user = await prisma.user.findUnique({
      where: { id: listing.userId },
      select: { ebayAccessToken: true },
    });

    if (!user?.ebayAccessToken) {
      return NextResponse.json({ error: 'eBay not connected' }, { status: 401 });
    }

    // Create eBay listing payload
    const ebayPayload = {
      product: {
        title: listing.title,
        description: listing.description,
        imageUrls: listing.images, // Now uses real URLs from Vercel Blob
        aspects: {
          Brand: [listing.brand || 'Unbranded'],
          Color: [listing.color || 'Not Specified'],
          Size: [listing.size || 'Not Specified'],
          Condition: [listing.condition || 'Used'],
        },
      },
      condition: listing.condition === 'NEW' ? 'NEW' : 'USED_EXCELLENT',
      categoryId: listing.category,
      listingPolicies: {
        paymentPolicyId: process.env.EBAY_PAYMENT_POLICY_ID,
        returnPolicyId: process.env.EBAY_RETURN_POLICY_ID,
        fulfillmentPolicyId: process.env.EBAY_FULFILLMENT_POLICY_ID,
      },
      pricingSummary: {
        price: {
          value: listing.price.toString(),
          currency: 'USD',
        },
      },
      merchantLocationKey: 'default',
      availability: {
        shipToLocationAvailability: {
          quantity: 1,
        },
      },
    };

    // Post to eBay
    const response = await fetch(
      'https://api.ebay.com/sell/inventory/v1/inventory_item',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.ebayAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ebayPayload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('eBay API Error:', data);
      return NextResponse.json(
        { error: 'eBay listing failed', details: data },
        { status: response.status }
      );
    }

    // Update listing with eBay info
    await prisma.listing.update({
      where: { id: listingId },
      data: {
        ebayId: data.sku,
        ebayStatus: 'ACTIVE',
        ebayUrl: data.listingUrl || null,
      },
    });

    return NextResponse.json({ success: true, ebayData: data });
  } catch (error) {
    console.error('Post to eBay error:', error);
    return NextResponse.json(
      { error: 'Failed to post to eBay' },
      { status: 500 }
    );
  }
}
