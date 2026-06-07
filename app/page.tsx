import { getProjects } from '@/lib/notion';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  let projects = [];
  try {
    projects = await getProjects();
  } catch (error) {
    console.error('Failed to fetch projects from Notion:', error);
  }

  return <HomeClient projects={projects} />;
}
