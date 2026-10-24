import HomeClient from '@/components/HomeClient';
import { cms, skipCmsCache } from '@/lib/cms';
import type { Project, SiteSetting } from '@repo/cms/generated/payload-types';

export const revalidate = 86400;

export default async function Home() {
  let projects: Project[] = [];
  let settings: SiteSetting | null = null;
  try {
    [projects, settings] = await Promise.all([cms.getProjects(), cms.getSiteSettings()]);
  } catch (error) {
    skipCmsCache(error, 'Could not load content from CMS, using fallbacks:');
  }

  return <HomeClient initialProjects={projects} settings={settings} />;
}
