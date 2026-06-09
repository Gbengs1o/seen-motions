import { NextResponse } from 'next/server';

function cloudinaryCredentials() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
  const parsed = cloudinaryUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);

  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || parsed?.[3],
    apiKey: process.env.CLOUDINARY_API_KEY || parsed?.[1],
    apiSecret: process.env.CLOUDINARY_API_SECRET || parsed?.[2]
  };
}

async function loadCloudinary() {
  const cloudinaryUrl = process.env.CLOUDINARY_URL;
  const shouldMaskInvalidUrl = Boolean(cloudinaryUrl && !cloudinaryUrl.startsWith('cloudinary://'));

  if (shouldMaskInvalidUrl) {
    delete process.env.CLOUDINARY_URL;
  }

  const module = await import('cloudinary');

  if (shouldMaskInvalidUrl && cloudinaryUrl) {
    process.env.CLOUDINARY_URL = cloudinaryUrl;
  }

  return module.v2;
}

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'seen-site';
  const suppliedPassword = request.headers.get('x-admin-password');

  if (suppliedPassword !== adminPassword) {
    return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = 'seen-motions';
  const { cloudName, apiKey, apiSecret } = cloudinaryCredentials();
  if (!apiSecret || apiSecret.includes('replace_with')) {
    return NextResponse.json({ error: 'Cloudinary API secret is missing.' }, { status: 500 });
  }

  const cloudinary = await loadCloudinary();
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);
  return NextResponse.json({
    timestamp,
    folder,
    signature,
    cloudName,
    apiKey
  });
}
