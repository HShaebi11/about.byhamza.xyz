import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RichText } from '@payloadcms/richtext-lexical/react';
import SubpageShell from '@/components/SubpageShell';
import { cms, skipCmsCache } from '@/lib/cms';
import { mediaUrl } from '@repo/cms/client';
import styles from './page.module.css';

export const revalidate = 86400;

interface Args {
  params: Promise<{ slug: string }>;
}

function formatDate(value?: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await cms.getPost(slug);
    if (post) {
      const cover = typeof post.coverImage === 'object' ? post.coverImage : null;
      const coverUrl = mediaUrl(cover?.url);
      return {
        title: post.title,
        description: post.excerpt || undefined,
        openGraph: coverUrl ? { images: [{ url: coverUrl }] } : undefined,
      };
    }
  } catch (error) {
    skipCmsCache(error, 'Could not load post metadata:');
  }
  return { title: 'Writing' };
}

export default async function BlogPostPage({ params }: Args) {
  const { slug } = await params;
  let post = null;
  try {
    post = await cms.getPost(slug);
  } catch (error) {
    skipCmsCache(error, 'Could not load post from CMS:');
  }
  if (!post) notFound();

  const cover = typeof post.coverImage === 'object' ? post.coverImage : null;
  const coverUrl = mediaUrl(cover?.url);

  return (
    <SubpageShell title={post.title} eyebrow={formatDate(post.publishedDate)}>
      {coverUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.cover} src={coverUrl} alt={cover?.alt || post.title} />
      )}
      <article className={styles.article}>
        <RichText data={post.content} />
      </article>
      {post.tags && post.tags.length > 0 && (
        <ul className={styles.tags}>
          {post.tags.map((t) => (
            <li key={t.id || t.tag} className={styles.tag}>{t.tag}</li>
          ))}
        </ul>
      )}
    </SubpageShell>
  );
}
