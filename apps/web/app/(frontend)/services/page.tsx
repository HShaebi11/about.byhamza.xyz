import type { Metadata } from 'next';
import SubpageShell from '@/components/SubpageShell';
import { cms } from '@/lib/cms';
import type { Service, SiteSetting } from '@repo/cms/generated/payload-types';
import styles from '../subpage.module.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Services',
  description: 'Design engineering engagements offered by Hamza Shaebi.',
};

export default async function ServicesPage() {
  let services: Service[] = [];
  let settings: SiteSetting | null = null;
  try {
    [services, settings] = await Promise.all([cms.getServices(), cms.getSiteSettings()]);
  } catch (error) {
    console.warn('Could not load services from studio CMS:', error);
  }

  const helloUrl = settings?.socials?.sayHello || 'https://hello.byhamza.xyz/';

  return (
    <SubpageShell title="services" eyebrow={`[${services.length}] ways to work together`}>
      {services.length === 0 ? (
        <p className={styles.empty}>No services listed yet.</p>
      ) : (
        <div className={styles.cardGrid}>
          {services.map((service) => (
            <div key={service.id} className={styles.card}>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              {service.priceLabel && <span className={styles.cardMeta}>{service.priceLabel}</span>}
              <p className={styles.cardBody}>{service.summary}</p>
              {service.deliverables && service.deliverables.length > 0 && (
                <ul className={styles.deliverables}>
                  {service.deliverables.map((d) => (
                    <li key={d.id || d.item}>{d.item}</li>
                  ))}
                </ul>
              )}
              <a href={helloUrl} className={styles.cardLink}>
                enquire ↗
              </a>
            </div>
          ))}
        </div>
      )}
    </SubpageShell>
  );
}
