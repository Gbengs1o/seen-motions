import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

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

  const { cloudName, apiKey, apiSecret } = cloudinaryCredentials();

  if (!cloudName || !apiKey || !apiSecret || apiSecret.includes('replace_with')) {
    return NextResponse.json({ error: 'Cloudinary environment variables are missing. Add CLOUDINARY_API_SECRET before uploading.' }, { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file received.' }, { status: 400 });
  }

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'upload';
    const blob = await put(`media/${Date.now()}-${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true
    });

    return NextResponse.json({
      url: blob.url,
      publicId: blob.pathname,
      resourceType: file.type.startsWith('video/') ? 'video' : 'image',
      width: null,
      height: null,
      format: safeName.split('.').pop() || ''
    });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const cloudinary = await loadCloudinary();
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

  const result = await new Promise<any>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'seen-motions', resource_type: 'auto' },
      (error, uploadResult) => (error ? reject(error) : resolve(uploadResult))
    );
    stream.end(buffer);
  });

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type,
    width: result.width,
    height: result.height,
    format: result.format
  });
}
