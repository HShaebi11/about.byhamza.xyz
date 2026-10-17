import HomeClient from '@/components/HomeClient';
import { getPayload } from 'payload';
import configPromise from '@payload-config';
import type { Project } from '@/payload-types';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let projects: Project[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const res = await payload.find({
      collection: 'projects',
      where: {
        published: {
          equals: true,
        },
      },
      sort: 'order',
    });
    projects = res.docs;
  } catch (error) {
    console.warn('Could not load projects from Payload CMS, using fallbacks:', error);
  }

  return <HomeClient initialProjects={projects} />;
}
