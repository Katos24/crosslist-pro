import { NextResponse } from 'next/server';
import { getEbayToken } from '@/lib/services/ebay';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'No authorization code' }, { status: 400 });
    }

    // Exchange code for token
    const token = await getEbayToken(code);

    // TODO: Get user ID from session
    const userId = 'temp-user-id'; // Replace with actual session user

    // Save token to database
    await prisma.user.update({
      where: { id: userId },
      data: { ebayToken: token }
    });

    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard?ebay=connected', request.url));

  } catch (error: any) {
    console.error('eBay OAuth error:', error);
    return NextResponse.redirect(new URL('/dashboard?ebay=error', request.url));
  }
}
