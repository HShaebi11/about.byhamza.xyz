import type { Metadata } from 'next';
import SubpageShell from '@/components/SubpageShell';
import { cms } from '@/lib/cms';
import { mediaUrl } from '@repo/cms/client';
import type { Tool } from '@repo/cms/generated/payload-types';
import styles from '../subpage.module.css';
import pageStyles from './page.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Software, hardware, and stack Hamza Shaebi works with.',
};

const CATEGORY_LABELS: Record<string, string> = {
  software: 'Software',
  hardware: 'Hardware',
  design: 'Design',
  development: 'Development',
  ai: 'AI',
  other: 'Other',
};

export default async function ToolsPage() {
  let tools: Tool[] = [];
  try {
    tools = await cms.getTools();
  } catch (error) {
    console.warn('Could not load tools from studio CMS:', error);
  }

  const grouped = tools.reduce<Record<string, Tool[]>>((acc, tool) => {
    const key = tool.category || 'other';
    (acc[key] ||= []).push(tool);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort(
    (a, b) => Object.keys(CATEGORY_LABELS).indexOf(a) - Object.keys(CATEGORY_LABELS).indexOf(b),
  );

  return (
    <SubpageShell title="tools" eyebrow={`[${tools.length}] in the stack`}>
      {tools.length === 0 ? (
        <p className={styles.empty}>No tools listed yet.</p>
      ) : (
        categories.map((category) => (
          <section key={category}>
            <h2 className={styles.groupLabel}>{CATEGORY_LABELS[category] || category}</h2>
            <div className={styles.cardGrid}>
              {grouped[category].map((tool) => {
                const icon = typeof tool.icon === 'object' ? tool.icon : null;
                const iconUrl = mediaUrl(icon?.url);
                return (
                  <div key={tool.id} className={styles.card}>
                    <div className={pageStyles.cardHeader}>
                      {iconUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={iconUrl} alt={icon?.alt || tool.name} className={pageStyles.icon} />
                      )}
                      <h3 className={styles.cardTitle}>{tool.name}</h3>
                    </div>
                    {tool.description && <p className={styles.cardBody}>{tool.description}</p>}
                    {tool.url && (
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                        {tool.url.replace(/^https?:\/\//, '')} ↗
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}
    </SubpageShell>
  );
}
