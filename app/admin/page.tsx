'use client';

import { useEffect, useState } from 'react';
import type { SiteContent } from '@/lib/content';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<SaveState>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/content').then((res) => res.json()).then(setContent);
  }, []);

  const update = (path: string, value: any) => {
    if (!content) return;
    const copy: any = structuredClone(content);
    const keys = path.split('.');
    let pointer = copy;
    keys.slice(0, -1).forEach((key) => {
      pointer = pointer[Number.isNaN(Number(key)) ? key : Number(key)];
    });
    pointer[keys.at(-1)!] = value;
    setContent(copy);
  };

  const save = async () => {
    if (!content) return;
    setStatus('saving');
    setMessage('Saving...');
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(content)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus('error');
      setMessage(data.error || 'Could not save content.');
      return;
    }
    setStatus('saved');
    setMessage('Saved. Refresh the landing page to see your edits.');
  };

  const upload = async (file: File, path: string) => {
    const form = new FormData();
    form.append('file', file);
    setMessage('Uploading media to Cloudinary...');
    const res = await fetch('/api/upload', { method: 'POST', headers: { 'x-admin-password': password }, body: form });
    const data = await res.json();
    if (!res.ok) {
      setStatus('error');
      setMessage(data.error || 'Upload failed.');
      return;
    }
    update(path, data.url);
    setMessage('Uploaded. Click Save Content to publish the new media URL.');
  };

  if (!content) return <main className="admin"><p>Loading...</p></main>;

  return (
    <main className="admin">
      <div className="adminTop">
        <div>
          <p className="kicker">/admin</p>
          <h1>Seen Motions CMS</h1>
          <p>Edit the landing page text, image URLs, videos, and Cloudinary uploads without touching code.</p>
        </div>
        <a href="/" target="_blank">Open site</a>
      </div>

      <section className="panel authPanel">
        <label>Admin password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Set ADMIN_PASSWORD in .env.local" />
        <button onClick={save} disabled={status === 'saving'}>{status === 'saving' ? 'Saving...' : 'Save Content'}</button>
        {message ? <p className={status === 'error' ? 'error' : 'notice'}>{message}</p> : null}
      </section>

      <section className="panel">
        <h2>Brand + Hero</h2>
        <Field label="Brand" value={content.brand} onChange={(v) => update('brand', v)} />
        <Field label="Hero title" value={content.hero.title} textarea onChange={(v) => update('hero.title', v)} />
        <Field label="Hero subtitle" value={content.hero.subtitle} onChange={(v) => update('hero.subtitle', v)} />
        <Field label="Hero button" value={content.hero.button} onChange={(v) => update('hero.button', v)} />
        <MediaField label="Logo URL" value={content.hero.logoUrl} onChange={(v) => update('hero.logoUrl', v)} onFile={(f) => upload(f, 'hero.logoUrl')} />
        <MediaField label="Hero background video URL" value={content.hero.backgroundVideoUrl || ''} onChange={(v) => update('hero.backgroundVideoUrl', v)} onFile={(f) => upload(f, 'hero.backgroundVideoUrl')} />
      </section>

      <section className="panel">
        <h2>Selected Works</h2>
        <Field label="Section title" value={content.works.title} onChange={(v) => update('works.title', v)} />
        <Field label="Year range" value={content.works.eyebrow} onChange={(v) => update('works.eyebrow', v)} />
        {content.works.items.map((item, index) => (
          <div className="nested" key={index}>
            <h3>Work {index + 1}</h3>
            <Field label="Title" value={item.title} onChange={(v) => update(`works.items.${index}.title`, v)} />
            <Field label="Year" value={item.year} onChange={(v) => update(`works.items.${index}.year`, v)} />
            <label>Media type</label>
            <select value={item.type} onChange={(e) => update(`works.items.${index}.type`, e.target.value)}>
              <option value="image">image</option>
              <option value="video">video</option>
            </select>
            <MediaField label="Media URL" value={item.mediaUrl} onChange={(v) => update(`works.items.${index}.mediaUrl`, v)} onFile={(f) => upload(f, `works.items.${index}.mediaUrl`)} />
          </div>
        ))}
      </section>

      <section className="panel">
        <h2>Services</h2>
        {content.services.map((service, index) => (
          <div className="nested" key={service.number}>
            <h3>Service {index + 1}</h3>
            <Field label="Number" value={service.number} onChange={(v) => update(`services.${index}.number`, v)} />
            <Field label="Title" value={service.title} textarea onChange={(v) => update(`services.${index}.title`, v)} />
            <Field label="Body" value={service.body} textarea onChange={(v) => update(`services.${index}.body`, v)} />
          </div>
        ))}
      </section>

      <section className="panel">
        <h2>Vision + Footer</h2>
        <Field label="Vision title" value={content.vision.title} onChange={(v) => update('vision.title', v)} />
        <Field label="Vision body" value={content.vision.body} textarea onChange={(v) => update('vision.body', v)} />
        <Field label="Copyright" value={content.footer.copyright} onChange={(v) => update('footer.copyright', v)} />
        <Field label="Footer links, comma separated" value={content.footer.links.join(', ')} onChange={(v) => update('footer.links', v.split(',').map((x) => x.trim()).filter(Boolean))} />
      </section>
    </main>
  );
}

function Field({ label, value, textarea, onChange }: { label: string; value: string; textarea?: boolean; onChange: (value: string) => void }) {
  return <div className="field"><label>{label}</label>{textarea ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} /> : <input value={value} onChange={(e) => onChange(e.target.value)} />}</div>;
}

function MediaField({ label, value, onChange, onFile }: { label: string; value: string; onChange: (value: string) => void; onFile: (file: File) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste Cloudinary image or video URL" />
      <input type="file" accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
    </div>
  );
}
