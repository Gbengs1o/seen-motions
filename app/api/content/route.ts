import { NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';

export async function GET(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'seen-site';
  const suppliedPassword = request.headers.get('x-admin-password');

  if (suppliedPassword !== adminPassword) {
    return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
  }

  try {
    return NextResponse.json(await getContent());
  } catch (error) {
    console.error('Content read failed', error);
    return NextResponse.json({ error: 'Could not read content.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD || 'seen-site';
  const suppliedPassword = request.headers.get('x-admin-password');

  if (suppliedPassword !== adminPassword) {
    return NextResponse.json({ error: 'Invalid admin password.' }, { status: 401 });
  }

  try {
    const content = await request.json();
    await saveContent(content);
    return NextResponse.json({ ok: true, content });
  } catch (error) {
    console.error('Content save failed', error);
    const message = error instanceof Error ? error.message : 'Could not save content.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
