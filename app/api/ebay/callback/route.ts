import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // This is the userId
    
    console.log('📥 eBay callback received:', { code: !!code, state });

    if (!code) {
      console.error('❌ No code received');
      return NextResponse.redirect(new URL('/dashboard?ebay=error', request.url));
    }

    const userId = state;
    if (!userId) {
      console.error('❌ No userId in state');
      return NextResponse.redirect(new URL('/dashboard?ebay=error', request.url));
    }

    console.log('🔑 Exchanging code for token...');

    // Exchange code for token
    const authString = Buffer.from(
      `${process.env.EBAY_APP_ID}:${process.env.EBAY_CERT_ID}`
    ).toString('base64');

    const tokenResponse = await axios.post(
      'https://api.ebay.com/identity/v1/oauth2/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.EBAY_RUNAME! // Use RuName here too
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authString}`
        }
      }
    );

    const { access_token, refresh_token } = tokenResponse.data;

    console.log('✅ Got tokens! Saving to database...');

    // Save tokens to database
    await prisma.user.update({
      where: { id: userId },
      data: {
        ebayToken: access_token,
        ebayRefreshToken: refresh_token
      }
    });

    console.log('✅ eBay account connected successfully!');

    // Redirect back to dashboard
    return NextResponse.redirect(new URL('/dashboard?ebay=connected', request.url));
  } catch (error: any) {
    console.error('❌ eBay callback error:', error.message);
    if (error.response) {
      console.error('eBay error response:', error.response.data);
    }
    return NextResponse.redirect(new URL('/dashboard?ebay=error', request.url));
  }
}

export const dynamic = 'force-dynamic';
