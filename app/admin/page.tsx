'use client';

import type { FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import type { LinkItem, PortfolioProject, SiteContent, WorkItem } from '@/lib/content';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const blankLink: LinkItem = { label: '', href: '' };
const blankWork: WorkItem = { title: '', year: '', slug: '', thumbnailUrl: '', videoUrl: '', description: '' };
const blankProject: PortfolioProject = {
  title: '',
  year: '',
  slug: '',
  discipline: '',
  buttonLabel: 'VIEW PROJECT',
  thumbnailUrl: '',
  videoUrl: '',
  description: ''
};

const panels = [
  ['site-navigation', 'Site Navigation'],
  ['homepage-hero', 'Homepage Hero'],
  ['homepage-works', 'Selected Works'],
  ['homepage-services', 'Services'],
  ['homepage-vision', 'Vision'],
  ['contact-page', 'Contact Page'],
  ['portfolio-page', 'Portfolio Page'],
  ['project-apartment', 'Project Apartment'],
  ['footer-links', 'Footer Links']
];

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<SaveState>('idle');
  const [message, setMessage] = useState('');

  const unlock = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('saving');
    setMessage('Checking password...');

    const res = await fetch('/api/content', {
      headers: { 'x-admin-password': password }
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setContent(null);
      setIsAuthenticated(false);
      setStatus('error');
      setMessage(data.error || 'Incorrect admin password.');
      return;
    }

    setContent(data);
    setIsAuthenticated(true);
    setStatus('saved');
    setMessage('Dashboard unlocked.');
  };

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

  const addToArray = (path: string, value: any, label: string) => {
    if (!content) return;
    const copy: any = structuredClone(content);
    const target = path.split('.').reduce((pointer, key) => pointer[key], copy);
    target.push(value);
    setContent(copy);
    setStatus('idle');
    setMessage(`${label} added. Fill it in, then save the fields you changed.`);
  };

  const save = async (label = 'Field') => {
    if (!content) return;
    setStatus('saving');
    setMessage(`Saving ${label.toLowerCase()}...`);

    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(content)
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus('error');
      setMessage(data.error || 'Could not save this field.');
      return;
    }

    setStatus('saved');
    setMessage(`${label} saved. Refresh the public site to see the update.`);
  };

  const upload = async (file: File, path: string, label: string) => {
    const form = new FormData();
    form.append('file', file);
    setStatus('saving');
    setMessage(`Uploading ${label.toLowerCase()}...`);

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-admin-password': password },
      body: form
    });
    const data = await res.json();

    if (!res.ok) {
      setStatus('error');
      setMessage(data.error || 'Upload failed.');
      return;
    }

    update(path, data.url);
    setStatus('saved');
    setMessage(`${label} uploaded. Save the media URL field to publish it.`);
  };

  if (!isAuthenticated || !content) {
    return (
      <main className="adminLogin">
        <form className="loginPanel" onSubmit={unlock}>
          <p className="kicker">/admin</p>
          <h1>Seen Motions CMS</h1>
          <p>Enter the admin password to edit the live site content.</p>
          <label htmlFor="admin-password">Admin password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          <button type="submit" disabled={status === 'saving'}>
            {status === 'saving' ? 'Checking...' : 'Unlock Dashboard'}
          </button>
          {message ? <p className={status === 'error' ? 'error' : 'notice'}>{message}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="admin adminDashboard">
      <aside className="adminSidebar">
        <div>
          <p className="kicker">Seen CMS</p>
          <strong>{content.brand}</strong>
        </div>
        <nav aria-label="Admin sections">
          {panels.map(([id, label]) => (
            <a href={`#${id}`} key={id}>{label}</a>
          ))}
        </nav>
      </aside>

      <div className="adminContent">
        <div className="adminTop">
          <div>
            <p className="kicker">/dashboard</p>
            <h1>Content Dashboard</h1>
            <p>Each page and section has its own panel. Save only the field you changed.</p>
          </div>
          <div className="adminActions">
            <a href="/" target="_blank">Open site</a>
            <button
              type="button"
              onClick={() => {
                setContent(null);
                setIsAuthenticated(false);
                setPassword('');
                setMessage('');
                setStatus('idle');
              }}
            >
              Lock
            </button>
          </div>
        </div>

        <div className="statusBar">
          <div>
            <span>Status</span>
            <strong>{status === 'saving' ? 'Saving' : isAuthenticated ? 'Unlocked' : 'Locked'}</strong>
          </div>
          <div>
            <span>Homepage works</span>
            <strong>{content.works.items.length}</strong>
          </div>
          <div>
            <span>Portfolio projects</span>
            <strong>{content.portfolio.projects.length}</strong>
          </div>
        </div>
        {message ? <p className={status === 'error' ? 'error dashboardMessage' : 'notice dashboardMessage'}>{message}</p> : null}

        <Panel id="site-navigation" eyebrow="Global" title="Site Navigation">
          <Field label="Brand text" value={content.brand} onChange={(v) => update('brand', v)} onSave={save} />
          <Field label="Header button text" value={content.header.ctaLabel} onChange={(v) => update('header.ctaLabel', v)} onSave={save} />
          <Field label="Header button link" value={content.header.ctaHref} onChange={(v) => update('header.ctaHref', v)} onSave={save} />
          {content.nav.map((item, index) => (
            <div className="nested" key={index}>
              <h3>Nav link {index + 1}</h3>
              <Field label="Label" value={item.label} onChange={(v) => update(`nav.${index}.label`, v)} onSave={save} />
              <Field label="Href" value={item.href} onChange={(v) => update(`nav.${index}.href`, v)} onSave={save} />
              <Field label="Homepage section id" value={item.sectionId || ''} onChange={(v) => update(`nav.${index}.sectionId`, v)} onSave={save} />
            </div>
          ))}
        </Panel>

        <Panel id="homepage-hero" eyebrow="Homepage" title="Hero">
          <Field label="Hero title" value={content.hero.title} textarea onChange={(v) => update('hero.title', v)} onSave={save} />
          <Field label="Hero subtitle" value={content.hero.subtitle} onChange={(v) => update('hero.subtitle', v)} onSave={save} />
          <Field label="Hero button text" value={content.hero.button} onChange={(v) => update('hero.button', v)} onSave={save} />
          <Field label="Hero button link" value={content.hero.buttonHref} onChange={(v) => update('hero.buttonHref', v)} onSave={save} />
          <MediaField
            label="Hero background video URL"
            value={content.hero.backgroundVideoUrl || ''}
            onChange={(v) => update('hero.backgroundVideoUrl', v)}
            onFile={(f) => upload(f, 'hero.backgroundVideoUrl', 'Hero background video')}
            onSave={save}
          />
        </Panel>

        <Panel id="homepage-works" eyebrow="Homepage" title="Selected Works">
          <Field label="Section title" value={content.works.title} onChange={(v) => update('works.title', v)} onSave={save} />
          <Field label="Year range" value={content.works.eyebrow} onChange={(v) => update('works.eyebrow', v)} onSave={save} />
          <Field label="View more button text" value={content.works.button} onChange={(v) => update('works.button', v)} onSave={save} />
          <Field label="View more button link" value={content.works.buttonHref} onChange={(v) => update('works.buttonHref', v)} onSave={save} />
          {content.works.items.map((item, index) => (
            <WorkEditor
              key={index}
              basePath={`works.items.${index}`}
              item={item}
              title={`Homepage work ${index + 1}`}
              update={update}
              upload={upload}
              save={save}
            />
          ))}
          <button className="addButton" type="button" onClick={() => addToArray('works.items', blankWork, 'Homepage work')}>Add homepage work</button>
        </Panel>

        <Panel id="homepage-services" eyebrow="Homepage" title="Services">
          {content.services.map((service, index) => (
            <div className="nested" key={index}>
              <h3>Service {index + 1}</h3>
              <Field label="Number" value={service.number} onChange={(v) => update(`services.${index}.number`, v)} onSave={save} />
              <Field label="Title" value={service.title} textarea onChange={(v) => update(`services.${index}.title`, v)} onSave={save} />
              <Field label="Body" value={service.body} textarea onChange={(v) => update(`services.${index}.body`, v)} onSave={save} />
            </div>
          ))}
        </Panel>

        <Panel id="homepage-vision" eyebrow="Homepage" title="Vision">
          <Field label="Vision title" value={content.vision.title} onChange={(v) => update('vision.title', v)} onSave={save} />
          <Field label="Vision body" value={content.vision.body} textarea onChange={(v) => update('vision.body', v)} onSave={save} />
        </Panel>

        <Panel id="contact-page" eyebrow="Contact" title="Contact Page">
          <Field label="Metadata title" value={content.contact.pageTitle} onChange={(v) => update('contact.pageTitle', v)} onSave={save} />
          <Field label="Metadata description" value={content.contact.pageDescription} onChange={(v) => update('contact.pageDescription', v)} onSave={save} />
          <Field label="Hero title" value={content.contact.heroTitle} textarea onChange={(v) => update('contact.heroTitle', v)} onSave={save} />
          <Field label="Hero subtitle" value={content.contact.heroSubtitle} onChange={(v) => update('contact.heroSubtitle', v)} onSave={save} />
          <Field label="Background word" value={content.contact.backgroundWord} onChange={(v) => update('contact.backgroundWord', v)} onSave={save} />
          <Field label="Form eyebrow" value={content.contact.formEyebrow} onChange={(v) => update('contact.formEyebrow', v)} onSave={save} />
          <Field label="Form title" value={content.contact.formTitle} onChange={(v) => update('contact.formTitle', v)} onSave={save} />
          <Field label="Submit button text" value={content.contact.submitLabel} onChange={(v) => update('contact.submitLabel', v)} onSave={save} />
          <Field label="Form helper text" value={content.contact.helperText} textarea onChange={(v) => update('contact.helperText', v)} onSave={save} />
          <Field label="Email subject" value={content.contact.emailSubject} onChange={(v) => update('contact.emailSubject', v)} onSave={save} />

          <div className="nested">
            <h3>Form labels</h3>
            {Object.entries(content.contact.labels).map(([key, value]) => (
              <Field key={key} label={key} value={value} onChange={(v) => update(`contact.labels.${key}`, v)} onSave={save} />
            ))}
          </div>

          <div className="nested">
            <h3>Form placeholders</h3>
            {Object.entries(content.contact.placeholders).map(([key, value]) => (
              <Field key={key} label={key} value={value} onChange={(v) => update(`contact.placeholders.${key}`, v)} onSave={save} />
            ))}
          </div>

          <div className="nested">
            <h3>Direct contact</h3>
            <Field label="Direct title" value={content.contact.directTitle} onChange={(v) => update('contact.directTitle', v)} onSave={save} />
            <Field label="Email" value={content.contact.email} onChange={(v) => update('contact.email', v)} onSave={save} />
            <Field label="Phone display" value={content.contact.phone} onChange={(v) => update('contact.phone', v)} onSave={save} />
            <Field label="Phone link" value={content.contact.phoneHref} onChange={(v) => update('contact.phoneHref', v)} onSave={save} />
            <Field label="WhatsApp display" value={content.contact.whatsappLabel} onChange={(v) => update('contact.whatsappLabel', v)} onSave={save} />
            <Field label="WhatsApp link" value={content.contact.whatsappHref} onChange={(v) => update('contact.whatsappHref', v)} onSave={save} />
          </div>

          <div className="nested">
            <h3>Contact social links</h3>
            <Field label="Connect title" value={content.contact.connectTitle} onChange={(v) => update('contact.connectTitle', v)} onSave={save} />
            {content.contact.quickLinks.map((link, index) => (
              <LinkEditor key={index} basePath={`contact.quickLinks.${index}`} link={link} update={update} save={save} />
            ))}
            <button className="addButton" type="button" onClick={() => addToArray('contact.quickLinks', blankLink, 'Contact link')}>Add contact link</button>
          </div>
        </Panel>

        <Panel id="portfolio-page" eyebrow="Portfolio" title="Portfolio Page">
          <Field label="Metadata title" value={content.portfolio.pageTitle} onChange={(v) => update('portfolio.pageTitle', v)} onSave={save} />
          <Field label="Metadata description" value={content.portfolio.pageDescription} onChange={(v) => update('portfolio.pageDescription', v)} onSave={save} />
          <Field label="Page heading" value={content.portfolio.title} textarea onChange={(v) => update('portfolio.title', v)} onSave={save} />
          <Field label="Count label" value={content.portfolio.countLabel} onChange={(v) => update('portfolio.countLabel', v)} onSave={save} />
          <Field label="Featured fallback button" value={content.portfolio.featuredButtonLabel} onChange={(v) => update('portfolio.featuredButtonLabel', v)} onSave={save} />
          <Field label="Project fallback button" value={content.portfolio.projectButtonLabel} onChange={(v) => update('portfolio.projectButtonLabel', v)} onSave={save} />
        </Panel>

        <Panel id="project-apartment" eyebrow="Portfolio" title="Project Apartment">
          <p className="notice">Portfolio projects live here separately from the other page text.</p>
          {content.portfolio.projects.map((project, index) => (
            <ProjectEditor
              key={index}
              basePath={`portfolio.projects.${index}`}
              project={project}
              title={`Portfolio project ${index + 1}`}
              update={update}
              upload={upload}
              save={save}
            />
          ))}
          <button className="addButton" type="button" onClick={() => addToArray('portfolio.projects', blankProject, 'Portfolio project')}>Add portfolio project</button>
        </Panel>

        <Panel id="footer-links" eyebrow="Global" title="Footer + Social Links">
          <Field label="Copyright" value={content.footer.copyright} onChange={(v) => update('footer.copyright', v)} onSave={save} />
          {content.footer.links.map((link, index) => (
            <LinkEditor key={index} basePath={`footer.links.${index}`} link={link} update={update} save={save} />
          ))}
          <button className="addButton" type="button" onClick={() => addToArray('footer.links', blankLink, 'Footer link')}>Add footer link</button>
        </Panel>
      </div>
    </main>
  );
}

function Panel({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="panel" id={id}>
      <div className="panelHeader">
        <p className="kicker">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  textarea,
  onChange,
  onSave
}: {
  label: string;
  value: string;
  textarea?: boolean;
  onChange: (value: string) => void;
  onSave: (label?: string) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="fieldControl">
        {textarea ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
        ) : (
          <input value={value} onChange={(e) => onChange(e.target.value)} />
        )}
        <button className="fieldSave" type="button" onClick={() => onSave(label)}>Save</button>
      </div>
    </div>
  );
}

function LinkEditor({
  basePath,
  link,
  update,
  save
}: {
  basePath: string;
  link: LinkItem;
  update: (path: string, value: any) => void;
  save: (label?: string) => void;
}) {
  return (
    <div className="nested">
      <Field label="Label" value={link.label} onChange={(v) => update(`${basePath}.label`, v)} onSave={save} />
      <Field label="Href" value={link.href} onChange={(v) => update(`${basePath}.href`, v)} onSave={save} />
    </div>
  );
}

function MediaField({
  label,
  value,
  onChange,
  onFile,
  onSave
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFile: (file: File) => void;
  onSave: (label?: string) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="fieldControl mediaControl">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image or video URL" />
        <input type="file" accept="image/*,video/*" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
        <button className="fieldSave" type="button" onClick={() => onSave(label)}>Save</button>
      </div>
    </div>
  );
}

function WorkEditor({
  title,
  basePath,
  item,
  update,
  upload,
  save
}: {
  title: string;
  basePath: string;
  item: WorkItem;
  update: (path: string, value: any) => void;
  upload: (file: File, path: string, label: string) => void;
  save: (label?: string) => void;
}) {
  return (
    <div className="nested">
      <h3>{title}</h3>
      <Field label="Title" value={item.title} onChange={(v) => update(`${basePath}.title`, v)} onSave={save} />
      <Field label="Year" value={item.year} onChange={(v) => update(`${basePath}.year`, v)} onSave={save} />
      <Field label="Detail page slug" value={item.slug || ''} onChange={(v) => update(`${basePath}.slug`, v)} onSave={save} />
      <MediaField
        label="Thumbnail image URL"
        value={item.thumbnailUrl || item.mediaUrl || ''}
        onChange={(v) => update(`${basePath}.thumbnailUrl`, v)}
        onFile={(f) => upload(f, `${basePath}.thumbnailUrl`, `${title} thumbnail`)}
        onSave={save}
      />
      <MediaField
        label="Video URL"
        value={item.videoUrl}
        onChange={(v) => update(`${basePath}.videoUrl`, v)}
        onFile={(f) => upload(f, `${basePath}.videoUrl`, `${title} video`)}
        onSave={save}
      />
      <Field label="Detail page description" value={item.description || ''} textarea onChange={(v) => update(`${basePath}.description`, v)} onSave={save} />
    </div>
  );
}

function ProjectEditor({
  title,
  basePath,
  project,
  update,
  upload,
  save
}: {
  title: string;
  basePath: string;
  project: PortfolioProject;
  update: (path: string, value: any) => void;
  upload: (file: File, path: string, label: string) => void;
  save: (label?: string) => void;
}) {
  return (
    <div className="nested">
      <h3>{title}</h3>
      <Field label="Title" value={project.title} onChange={(v) => update(`${basePath}.title`, v)} onSave={save} />
      <Field label="Year" value={project.year} onChange={(v) => update(`${basePath}.year`, v)} onSave={save} />
      <Field label="Detail page slug" value={project.slug || ''} onChange={(v) => update(`${basePath}.slug`, v)} onSave={save} />
      <Field label="Discipline" value={project.discipline} onChange={(v) => update(`${basePath}.discipline`, v)} onSave={save} />
      <Field label="Button label" value={project.buttonLabel} onChange={(v) => update(`${basePath}.buttonLabel`, v)} onSave={save} />
      <MediaField
        label="Thumbnail image URL"
        value={project.thumbnailUrl || project.mediaUrl || ''}
        onChange={(v) => update(`${basePath}.thumbnailUrl`, v)}
        onFile={(f) => upload(f, `${basePath}.thumbnailUrl`, `${title} thumbnail`)}
        onSave={save}
      />
      <MediaField
        label="Video URL"
        value={project.videoUrl}
        onChange={(v) => update(`${basePath}.videoUrl`, v)}
        onFile={(f) => upload(f, `${basePath}.videoUrl`, `${title} video`)}
        onSave={save}
      />
      <Field label="Detail page description" value={project.description || ''} textarea onChange={(v) => update(`${basePath}.description`, v)} onSave={save} />
    </div>
  );
}
