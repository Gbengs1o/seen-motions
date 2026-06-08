import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const suppliedPassword = request.headers.get('x-admin-password');

  if (process.env.ADMIN_PASSWORD && suppliedPassword !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'seen-motions';
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret || apiSecret.includes('replace_with')) {
    return NextResponse.json({ error: 'Cloudinary API secret is missing.' }, { status: 500 });
  }

  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);
  return NextResponse.json({
    timestamp,
    folder,
    signature,
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY
  });
}
