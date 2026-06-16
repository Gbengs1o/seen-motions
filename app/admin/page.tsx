'use client';

import type { FormEvent, ReactNode } from 'react';
import { upload as uploadBlob } from '@vercel/blob/client';
import { useState } from 'react';
import type { CategoryItem, LinkItem, PortfolioProject, SiteContent, WorkItem } from '@/lib/content';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

const saveTimeoutMs = 30000;
const uploadTimeoutMs = 20 * 60 * 1000;

const blankLink: LinkItem = { label: '', href: '' };
const blankCategory: CategoryItem = { name: '', slug: '', description: '' };
const blankWork: WorkItem = { title: '', year: '', slug: '', thumbnailUrl: '', videoUrl: '', description: '', categorySlugs: [], socialLinks: [] };
const blankProject: PortfolioProject = {
  title: '',
  year: '',
  slug: '',
  discipline: '',
  buttonLabel: 'VIEW PROJECT',
  thumbnailUrl: '',
  videoUrl: '',
  description: '',
  categorySlugs: [],
  socialLinks: []
};

const panels = [
  ['site-navigation', 'Site Navigation'],
  ['homepage-hero', 'Homepage Hero'],
  ['homepage-works', 'Homepage Featured Videos'],
  ['homepage-services', 'Services'],
  ['homepage-vision', 'Vision'],
  ['contact-page', 'Contact Page'],
  ['portfolio-page', 'Portfolio Text'],
  ['portfolio-categories', 'Video Categories'],
  ['project-apartment', 'Portfolio Videos'],
  ['footer-links', 'Footer Links']
];

export default function AdminPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<SaveState>('idle');
  const [message, setMessage] = useState('');
  const [changes, setChanges] = useState<string[]>([]);
  const [showChanges, setShowChanges] = useState(false);

  const hasChanges = changes.length > 0;

  const trackChange = (label: string) => {
    setChanges((current) => current.includes(label) ? current : [...current, label]);
    setStatus('idle');
    setMessage('You have unsaved changes. Use the floating Save button to publish them.');
  };

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
    setChanges([]);
    setShowChanges(false);
    setMessage('Dashboard unlocked.');
  };

  const update = (path: string, value: any, label?: string) => {
    if (!content) return;
    const copy: any = structuredClone(content);
    const keys = path.split('.');
    let pointer = copy;

    keys.slice(0, -1).forEach((key) => {
      pointer = pointer[Number.isNaN(Number(key)) ? key : Number(key)];
    });

    pointer[keys.at(-1)!] = value;
    setContent(copy);
    trackChange(label || readablePath(path));
  };

  const addToArray = (path: string, value: any, label: string) => {
    if (!content) return;
    const copy: any = structuredClone(content);
    const keys = path.split('.');
    const last = keys.at(-1)!;
    const parent = keys.slice(0, -1).reduce((pointer, key) => pointer[key], copy);
    if (!Array.isArray(parent[last])) {
      parent[last] = [];
    }
    const target = parent[last];
    target.push(value);
    setContent(copy);
    trackChange(`Added ${label}`);
  };

  const removeFromArray = (path: string, index: number, label: string) => {
    if (!content) return;
    const copy: any = structuredClone(content);
    const target = path.split('.').reduce((pointer, key) => pointer[key], copy);
    if (!Array.isArray(target)) return;
    target.splice(index, 1);
    setContent(copy);
    trackChange(`Deleted ${label}`);
  };

  const save = async () => {
    if (!content) return;
    setStatus('saving');
    setMessage('Saving all changes...');

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), saveTimeoutMs);

    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'content-type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify(content),
        signal: controller.signal
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus('error');
        setMessage(data.error || 'Could not save these changes.');
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (data.content) {
        setContent(data.content);
      }
      setChanges([]);
      setShowChanges(false);
      setStatus('saved');
      setMessage('All changes saved. Refresh the public site to see the update.');
    } catch (error) {
      setStatus('error');
      const message = error instanceof DOMException && error.name === 'AbortError'
        ? 'Saving took too long. Please try again; nothing was published.'
        : error instanceof Error
          ? error.message
          : 'Could not save these changes.';
      setMessage(message);
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const upload = async (file: File, path: string, label: string) => {
    setStatus('saving');
    setMessage(`Preparing ${label.toLowerCase()} replacement...`);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), uploadTimeoutMs);

    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'upload';
      const blob = await uploadBlob(`media/${Date.now()}-${safeName}`, file, {
        access: 'public',
        abortSignal: controller.signal,
        contentType: file.type || undefined,
        handleUploadUrl: '/api/upload',
        headers: { 'x-admin-password': password },
        multipart: file.size > 5 * 1024 * 1024,
        onUploadProgress: ({ percentage }) => {
          setMessage(`Uploading ${label.toLowerCase()}... ${Math.round(percentage)}%`);
        }
      });

      update(path, blob.url, `${label} uploaded`);
      setStatus('idle');
      setMessage(`${label} uploaded and placed in the field. Click the floating Save button to publish it.`);
    } catch (error) {
      setStatus('error');
      const message = error instanceof DOMException && error.name === 'AbortError'
        ? 'Upload took too long and was stopped. Try again with a smaller/compressed file or a stronger connection.'
        : error instanceof Error
          ? error.message
          : 'Upload failed.';
      setMessage(`${label} upload failed: ${message}`);
    } finally {
      window.clearTimeout(timeout);
    }
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
            <p>Edit anything you need, then use the floating Save button to publish all changes at once.</p>
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
                setChanges([]);
                setShowChanges(false);
              }}
            >
              Lock
            </button>
          </div>
        </div>

        <FloatingSaveBar
          changes={changes}
          hasChanges={hasChanges}
          isOpen={showChanges}
          onSave={save}
          onToggle={() => setShowChanges((value) => !value)}
          status={status}
        />

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
              categories={content.portfolio.categories || []}
              item={item}
              title={`Homepage work ${index + 1}`}
              update={update}
              upload={upload}
              save={save}
              addToArray={addToArray}
              removeFromArray={removeFromArray}
              onRemove={() => removeFromArray('works.items', index, `Homepage work ${index + 1}`)}
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
          <div className="adminGuide">
            <strong>What this controls</strong>
            <p>This is only the text around the portfolio page. Add, edit and organize the actual videos in the next two panels.</p>
          </div>
          <Field label="Metadata title" value={content.portfolio.pageTitle} onChange={(v) => update('portfolio.pageTitle', v)} onSave={save} />
          <Field label="Metadata description" value={content.portfolio.pageDescription} onChange={(v) => update('portfolio.pageDescription', v)} onSave={save} />
          <Field label="Page heading" value={content.portfolio.title} textarea onChange={(v) => update('portfolio.title', v)} onSave={save} />
          <Field label="Count label" value={content.portfolio.countLabel} onChange={(v) => update('portfolio.countLabel', v)} onSave={save} />
          <Field label="Featured fallback button" value={content.portfolio.featuredButtonLabel} onChange={(v) => update('portfolio.featuredButtonLabel', v)} onSave={save} />
          <Field label="Project fallback button" value={content.portfolio.projectButtonLabel} onChange={(v) => update('portfolio.projectButtonLabel', v)} onSave={save} />
        </Panel>

        <Panel id="portfolio-categories" eyebrow="Portfolio" title="Video Categories">
          <div className="portfolioManagerIntro">
            <div>
              <strong>Make groups for your work.</strong>
              <p>Examples: Tech, Storytelling, Brand Films. Each category automatically gets a shareable link.</p>
            </div>
            <button className="addButton addButtonInline" type="button" onClick={() => addToArray('portfolio.categories', blankCategory, 'Category')}>Add category</button>
          </div>

          <div className="categoryList">
            {(content.portfolio.categories || []).map((category, index) => (
              <CategoryEditor
                basePath={`portfolio.categories.${index}`}
                category={category}
                index={index}
                key={`${category.slug}-${index}`}
                onRemove={() => removeFromArray('portfolio.categories', index, `Category ${index + 1}`)}
                save={save}
                update={update}
              />
            ))}
          </div>
        </Panel>

        <Panel id="project-apartment" eyebrow="Portfolio" title="Portfolio Videos">
          <div className="portfolioManagerIntro">
            <div>
              <strong>Add the videos people will watch.</strong>
              <p>Upload a thumbnail, upload or paste the video URL, choose categories, then save each part you changed.</p>
            </div>
            <button className="addButton addButtonInline" type="button" onClick={() => addToArray('portfolio.projects', blankProject, 'Portfolio video')}>Add video</button>
          </div>

          <div className="videoList">
            {content.portfolio.projects.map((project, index) => (
              <ProjectEditor
                key={index}
                basePath={`portfolio.projects.${index}`}
                categories={content.portfolio.categories || []}
                index={index}
                project={project}
                title={`Video ${index + 1}`}
                update={update}
                upload={upload}
                save={save}
                addToArray={addToArray}
                removeFromArray={removeFromArray}
                onRemove={() => removeFromArray('portfolio.projects', index, `Portfolio video ${index + 1}`)}
              />
            ))}
          </div>
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

function FloatingSaveBar({
  changes,
  hasChanges,
  isOpen,
  onSave,
  onToggle,
  status
}: {
  changes: string[];
  hasChanges: boolean;
  isOpen: boolean;
  onSave: () => void;
  onToggle: () => void;
  status: SaveState;
}) {
  return (
    <div className={hasChanges ? 'floatingSaveBar isDirty' : 'floatingSaveBar'}>
      <div>
        <span>{status === 'saving' && !hasChanges ? 'Upload in progress' : hasChanges ? `${changes.length} unsaved change${changes.length === 1 ? '' : 's'}` : 'All changes saved'}</span>
        <strong>{status === 'saving' ? 'Saving...' : hasChanges ? 'Ready to publish' : 'Dashboard is current'}</strong>
      </div>
      <div className="floatingSaveActions">
        <button
          className="floatingSaveButton"
          disabled={!hasChanges || status === 'saving'}
          onClick={onSave}
          type="button"
        >
          {status === 'saving' ? 'Saving' : 'Save changes'}
        </button>
        <button
          className="floatingChangesButton"
          disabled={!hasChanges}
          onClick={onToggle}
          type="button"
        >
          {isOpen ? 'Hide' : 'Changes'}
        </button>
      </div>
      {isOpen && hasChanges ? (
        <div className="floatingChangesPanel">
          <p>Pending changes</p>
          <ul>
            {changes.map((change) => (
              <li key={change}>{change}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function Field({
  label,
  value,
  textarea,
  onChange
}: {
  label: string;
  value: string;
  textarea?: boolean;
  onChange: (value: string) => void;
  onSave?: (label?: string) => void;
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
      </div>
    </div>
  );
}

function LinkEditor({
  basePath,
  link,
  update,
  save,
  onRemove
}: {
  basePath: string;
  link: LinkItem;
  update: (path: string, value: any) => void;
  save: (label?: string) => void;
  onRemove?: () => void;
}) {
  return (
    <div className="nested">
      <Field label="Label" value={link.label} onChange={(v) => update(`${basePath}.label`, v)} onSave={save} />
      <Field label="Href" value={link.href} onChange={(v) => update(`${basePath}.href`, v)} onSave={save} />
      {onRemove ? <button className="removeButton" type="button" onClick={onRemove}>Remove link</button> : null}
    </div>
  );
}

function CategoryEditor({
  basePath,
  category,
  index,
  update,
  save,
  onRemove
}: {
  basePath: string;
  category: CategoryItem;
  index: number;
  update: (path: string, value: any) => void;
  save: (label?: string) => void;
  onRemove: () => void;
}) {
  const shareSlug = category.slug || adminCategorySlug(category) || 'category-link';

  return (
    <section className="categoryCard">
      <div className="managerCardHeader">
        <div>
          <span>Category {index + 1}</span>
          <h3>{category.name || 'Untitled category'}</h3>
        </div>
        <a href={`/portfolio/category/${shareSlug}`} target="_blank">View</a>
      </div>

      <div className="friendlyFields">
        <Field label="Category name" value={category.name} onChange={(v) => update(`${basePath}.name`, v)} onSave={save} />
        <Field label="Share link ending" value={category.slug} onChange={(v) => update(`${basePath}.slug`, cleanSlugInput(v))} onSave={save} />
        <Field label="Short description" value={category.description || ''} textarea onChange={(v) => update(`${basePath}.description`, v)} onSave={save} />
      </div>

      <p className="plainHint">Share link: /portfolio/category/{shareSlug}</p>
      <button className="removeButton" type="button" onClick={onRemove}>Delete category</button>
    </section>
  );
}

function MediaField({
  label,
  value,
  onChange,
  onFile
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFile: (file: File) => void;
  onSave?: (label?: string) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="fieldControl mediaControl">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Paste image or video URL" />
        <input
          type="file"
          accept="image/*,video/*"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            if (file) {
              onFile(file);
            }
            e.currentTarget.value = '';
          }}
        />
      </div>
      {value ? (
        <button className="removeButton removeButtonInline" type="button" onClick={() => onChange('')}>
          Remove current media
        </button>
      ) : null}
    </div>
  );
}

function WorkEditor({
  title,
  basePath,
  categories,
  item,
  update,
  upload,
  save,
  addToArray,
  removeFromArray,
  onRemove
}: {
  title: string;
  basePath: string;
  categories: CategoryItem[];
  item: WorkItem;
  update: (path: string, value: any) => void;
  upload: (file: File, path: string, label: string) => void;
  save: (label?: string) => void;
  addToArray: (path: string, value: any, label: string) => void;
  removeFromArray: (path: string, index: number, label: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="nested">
      <h3>{title}</h3>
      <Field label="Title" value={item.title} onChange={(v) => update(`${basePath}.title`, v)} onSave={save} />
      <Field label="Year" value={item.year} onChange={(v) => update(`${basePath}.year`, v)} onSave={save} />
      <Field label="Detail page slug" value={item.slug || ''} onChange={(v) => update(`${basePath}.slug`, cleanSlugInput(v))} onSave={save} />
      <CategoryPicker
        categories={categories}
        label="Assigned categories"
        onChange={(slugs) => update(`${basePath}.categorySlugs`, slugs)}
        onSave={save}
        value={item.categorySlugs || []}
      />
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
      <div className="nested">
        <h3>Client / social links</h3>
        {(item.socialLinks || []).map((link, index) => (
          <LinkEditor
            basePath={`${basePath}.socialLinks.${index}`}
            key={`${link.label}-${index}`}
            link={link}
            onRemove={() => removeFromArray(`${basePath}.socialLinks`, index, `${title} link ${index + 1}`)}
            save={save}
            update={update}
          />
        ))}
        <button className="addButton" type="button" onClick={() => addToArray(`${basePath}.socialLinks`, blankLink, `${title} social link`)}>Add social link</button>
      </div>
      <button className="removeButton" type="button" onClick={onRemove}>Delete video</button>
    </div>
  );
}

function ProjectEditor({
  title,
  basePath,
  categories,
  index,
  project,
  update,
  upload,
  save,
  addToArray,
  removeFromArray,
  onRemove
}: {
  title: string;
  basePath: string;
  categories: CategoryItem[];
  index: number;
  project: PortfolioProject;
  update: (path: string, value: any) => void;
  upload: (file: File, path: string, label: string) => void;
  save: (label?: string) => void;
  addToArray: (path: string, value: any, label: string) => void;
  removeFromArray: (path: string, index: number, label: string) => void;
  onRemove: () => void;
}) {
  const selectedCategoryNames = categories
    .filter((category) => (project.categorySlugs || []).includes(adminCategorySlug(category)))
    .map((category) => category.name);
  const shareEnding = project.slug || adminCategorySlug({ name: project.title, slug: '' }) || 'video-link';

  return (
    <section className="videoEditor">
      <div className="videoHeader">
        <div className="videoPreview">
          {project.thumbnailUrl || project.mediaUrl ? (
            <img alt="" src={project.thumbnailUrl || project.mediaUrl} />
          ) : (
            <span>No thumbnail yet</span>
          )}
        </div>
        <div>
          <span>Video {index + 1}</span>
          <h3>{project.title || title}</h3>
          <p>{selectedCategoryNames.length ? selectedCategoryNames.join(', ') : 'No category selected yet'}</p>
          <div className="managerActions">
            <a href={`/portfolio/${shareEnding}`} target="_blank">View page</a>
            <button className="removeButton removeButtonInline" type="button" onClick={onRemove}>Delete video</button>
          </div>
        </div>
      </div>

      <div className="managerStep">
        <span>1</span>
        <div>
          <h4>Name and page link</h4>
          <p>This is what visitors see and the link you can share for this video.</p>
        </div>
      </div>
      <div className="friendlyFields twoColumns">
        <Field label="Video name" value={project.title} onChange={(v) => update(`${basePath}.title`, v)} onSave={save} />
        <Field label="Year" value={project.year} onChange={(v) => update(`${basePath}.year`, v)} onSave={save} />
        <Field label="Share link ending" value={project.slug || ''} onChange={(v) => update(`${basePath}.slug`, cleanSlugInput(v))} onSave={save} />
        <Field label="Small label under video" value={project.discipline} onChange={(v) => update(`${basePath}.discipline`, v)} onSave={save} />
      </div>

      <div className="managerStep">
        <span>2</span>
        <div>
          <h4>Choose where it belongs</h4>
          <p>Pick one or more categories. Those category links will show only matching videos.</p>
        </div>
      </div>
      <CategoryPicker
        categories={categories}
        label="Show this video in"
        onChange={(slugs) => update(`${basePath}.categorySlugs`, slugs)}
        onSave={save}
        value={project.categorySlugs || []}
      />

      <div className="managerStep">
        <span>3</span>
        <div>
          <h4>Thumbnail and video</h4>
          <p>The thumbnail shows first. The video plays on hover and opens on the video page.</p>
        </div>
      </div>
      <div className="friendlyFields">
        <MediaField
          label="Thumbnail image"
          value={project.thumbnailUrl || project.mediaUrl || ''}
          onChange={(v) => update(`${basePath}.thumbnailUrl`, v)}
          onFile={(f) => upload(f, `${basePath}.thumbnailUrl`, `${title} thumbnail`)}
          onSave={save}
        />
        <MediaField
          label="Video file or direct MP4 URL"
          value={project.videoUrl}
          onChange={(v) => update(`${basePath}.videoUrl`, v)}
          onFile={(f) => upload(f, `${basePath}.videoUrl`, `${title} video`)}
          onSave={save}
        />
      </div>

      <div className="managerStep">
        <span>4</span>
        <div>
          <h4>Description and client links</h4>
          <p>Add a short note and any client/social links that should appear on the video page.</p>
        </div>
      </div>
      <Field label="About this video" value={project.description || ''} textarea onChange={(v) => update(`${basePath}.description`, v)} onSave={save} />

      <div className="linkList">
        {(project.socialLinks || []).map((link, linkIndex) => (
          <LinkEditor
            basePath={`${basePath}.socialLinks.${linkIndex}`}
            key={`${link.label}-${linkIndex}`}
            link={link}
            onRemove={() => removeFromArray(`${basePath}.socialLinks`, linkIndex, `${title} link ${linkIndex + 1}`)}
            save={save}
            update={update}
          />
        ))}
      </div>
      <button className="addButton" type="button" onClick={() => addToArray(`${basePath}.socialLinks`, blankLink, `${title} social link`)}>Add client or social link</button>
    </section>
  );
}

function CategoryPicker({
  label,
  value,
  categories,
  onChange
}: {
  label: string;
  value: string[];
  categories: CategoryItem[];
  onChange: (value: string[]) => void;
  onSave?: (label?: string) => void;
}) {
  const selected = new Set(value);
  const toggle = (slug: string) => {
    if (!slug) return;
    const next = selected.has(slug)
      ? value.filter((item) => item !== slug)
      : [...value, slug];
    onChange(next);
  };

  return (
    <div className="field">
      <label>{label}</label>
      {categories.length ? (
        <div className="categoryPicker">
          {categories.map((category) => {
            const slug = adminCategorySlug(category);
            return (
              <label className="categoryChoice" key={slug || category.name}>
                <input
                  checked={selected.has(slug)}
                  onChange={() => toggle(slug)}
                  type="checkbox"
                />
                <span>{category.name}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <p className="notice">Create a category first, then assign this video to it.</p>
      )}
    </div>
  );
}

function adminCategorySlug(category: CategoryItem) {
  return (category.slug || category.name)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function cleanSlugInput(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    const lastPathPart = url.pathname.split('/').filter(Boolean).at(-1);
    return adminSlugify(lastPathPart || url.hostname);
  } catch {
    return adminSlugify(trimmed);
  }
}

function adminSlugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function readablePath(path: string) {
  const labels: Record<string, string> = {
    brand: 'Brand text',
    header: 'Navigation',
    hero: 'Homepage hero',
    works: 'Homepage featured videos',
    services: 'Services',
    vision: 'Vision section',
    contact: 'Contact page',
    portfolio: 'Portfolio',
    footer: 'Footer',
    categories: 'Video categories',
    projects: 'Portfolio videos',
    items: 'Homepage videos',
    title: 'Title',
    pageTitle: 'Page title',
    pageDescription: 'Page description',
    description: 'Description',
    thumbnailUrl: 'Thumbnail',
    videoUrl: 'Video file',
    categorySlugs: 'Assigned categories',
    socialLinks: 'Client/social links',
    slug: 'Share link',
    href: 'Link URL',
    label: 'Link label'
  };

  const parts = path
    .split('.')
    .filter((part) => Number.isNaN(Number(part)))
    .map((part) => labels[part] || part.replace(/([A-Z])/g, ' $1').trim());

  return parts.join(' / ');
}
