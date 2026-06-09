import { NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';

export async function GET(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'seen-site';
  const suppliedPassword = request.headers.get('x-admin-password');

  if (suppliedPassword !== adminPassword) {
    return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
  }

  return NextResponse.json(await getContent());
}

export async function PUT(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'seen-site';
  const suppliedPassword = request.headers.get('x-admin-password');

  if (suppliedPassword !== adminPassword) {
    return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
  }

  const content = await request.json();
  await saveContent(content);
  return NextResponse.json({ ok: true, content });
}
