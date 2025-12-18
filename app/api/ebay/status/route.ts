import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ connected: false });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { ebayToken: true }
    });

    return NextResponse.json({ 
      connected: !!user?.ebayToken 
    });
  } catch (error) {
    return NextResponse.json({ connected: false });
  }
}

export const dynamic = 'force-dynamic';
