import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Upload all images to Vercel Blob
    const uploadPromises = files.map(async (file) => {
      const blob = await put(file.name, file, {
        access: 'public',
      });
      return blob.url;
    });

    const urls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    );
  }
}