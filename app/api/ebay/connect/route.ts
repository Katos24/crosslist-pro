import { NextResponse } from 'next/server';
import { getEbayAuthUrl } from '@/lib/services/ebay';

export async function GET() {
  try {
    const authUrl = getEbayAuthUrl();
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
