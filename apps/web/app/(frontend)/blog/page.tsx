import Link from 'next/link';
import type { Metadata } from 'next';
import SubpageShell from '@/components/SubpageShell';
import { cms, skipCmsCache } from '@/lib/cms';
import type { Post } from '@repo/cms/generated/payload-types';
import styles from '../subpage.module.css';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Notes, essays, and build logs by Hamza Shaebi.',
};

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default async function BlogIndexPage() {
  let posts: Post[] = [];
  try {
    posts = await cms.getPosts();
  } catch (error) {
    skipCmsCache(error, 'Could not load posts from CMS:');
  }

  return (
    <SubpageShell title="writing" eyebrow={`[${posts.length}] entries`}>
      {posts.length === 0 ? (
        <p className={styles.empty}>Nothing published yet — check back soon.</p>
      ) : (
        <ol className={styles.list}>
          {posts.map((post, i) => (
            <li key={post.id} className={styles.listItem}>
              <Link href={post.slug ? `/blog/${post.slug}` : '/blog'} className={styles.listLink}>
                <span className={styles.listIndex}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.listTitle}>{post.title}</span>
                <span className={styles.listMeta}>{formatDate(post.publishedDate)}</span>
              </Link>
              {post.excerpt && <p className={styles.listExcerpt}>{post.excerpt}</p>}
            </li>
          ))}
        </ol>
      )}
    </SubpageShell>
  );
}
