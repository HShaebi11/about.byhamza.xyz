import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { cms } from "@/lib/cms";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/tools`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const [posts, projects] = await Promise.all([cms.getPosts(), cms.getProjects()]);
    for (const post of posts) {
      if (post.slug) {
        entries.push({
          url: `${siteConfig.url}/blog/${post.slug}`,
          lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
    for (const project of projects) {
      if (project.slug) {
        entries.push({
          url: `${siteConfig.url}/project/${project.slug}`,
          lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // Studio unreachable — return static entries only
  }

  return entries;
}
