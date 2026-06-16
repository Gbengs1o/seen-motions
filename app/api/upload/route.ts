import { handleUpload } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

const maxUploadSize = 1024 * 1024 * 1024 * 2;

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'seen-site';
  const suppliedPassword = request.headers.get('x-admin-password');

  if (suppliedPassword !== adminPassword) {
    return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/*', 'video/*'],
        addRandomSuffix: true,
        maximumSizeInBytes: maxUploadSize
      }),
      onUploadCompleted: async ({ blob }) => {
        console.log('[upload] completed', { pathname: blob.pathname, url: blob.url });
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('[upload] failed', error);
    const message = error instanceof Error ? error.message : 'Upload failed.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
