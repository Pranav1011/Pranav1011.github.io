import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { getCollection, getEntry } from 'astro:content';

async function single<C extends 'site' | 'experience' | 'publication' | 'alsoBuilt'>(collection: C, id: string) {
  const entry = await getEntry(collection, id);
  if (!entry) throw new Error(`src/content/${id}.md is missing`);
  return entry;
}

export const getSite = async () => (await single('site', 'site')).data;
export const getExperience = async () => (await single('experience', 'experience')).data.roles;
export const getPublication = async () => (await single('publication', 'publication')).data;
export const getAlsoBuilt = async () => (await single('alsoBuilt', 'also-built')).data.items;

export async function getFeatured() {
  const projects = await getCollection('projects', ({ data }) => data.featured);
  return projects.sort((a, b) => a.data.order - b.data.order);
}

/** Resume links render only once the file named by `resume` in site.md exists in public/ (Phase 5). */
export async function getResumeHref(): Promise<string | undefined> {
  const { resume } = await getSite();
  return existsSync(join(process.cwd(), 'public', resume.replace(/^\//, ''))) ? resume : undefined;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2025-08" → "Aug 2025" */
export function formatMonth(ym: string) {
  const [year, month] = ym.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}
