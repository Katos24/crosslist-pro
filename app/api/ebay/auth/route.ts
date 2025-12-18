import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Build eBay OAuth URL with RuName
    const ebayAuthUrl = new URL('https://auth.ebay.com/oauth2/authorize');
    ebayAuthUrl.searchParams.append('client_id', process.env.EBAY_APP_ID!);
    ebayAuthUrl.searchParams.append('response_type', 'code');
    ebayAuthUrl.searchParams.append('redirect_uri', process.env.EBAY_RUNAME!); // Use RuName here
    ebayAuthUrl.searchParams.append('scope', [
      'https://api.ebay.com/oauth/api_scope/sell.inventory',
      'https://api.ebay.com/oauth/api_scope/sell.account',
      'https://api.ebay.com/oauth/api_scope/sell.fulfillment'
    ].join(' '));
    ebayAuthUrl.searchParams.append('state', userId);

    return NextResponse.redirect(ebayAuthUrl.toString());
  } catch (error: any) {
    console.error('eBay auth error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
