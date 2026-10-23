import HomeClient from '@/components/HomeClient';
import { cms } from '@/lib/cms';
import type { Project, SiteSetting } from '@repo/cms/generated/payload-types';

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  let projects: Project[] = [];
  let settings: SiteSetting | null = null;
  try {
    [projects, settings] = await Promise.all([cms.getProjects(), cms.getSiteSettings()]);
  } catch (error) {
    console.warn('Could not load content from studio CMS, using fallbacks:', error);
  }

  return <HomeClient initialProjects={projects} settings={settings} />;
}
