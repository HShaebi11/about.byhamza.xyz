import Link from 'next/link';
import styles from './SubpageShell.module.css';

interface SubpageShellProps {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}

export default function SubpageShell({ title, eyebrow, children }: SubpageShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.topBar}>
        <span className={styles.windowTitle}>Hamza Shaebi</span>
        <Link href="/" className={styles.homeLink}>[ Home ]</Link>
        <div className={styles.topBarLine} />
      </header>
      <main className={styles.content}>
        <div className={styles.headingRow}>
          {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
          <h1 className={styles.pageTitle}>{title}</h1>
        </div>
        {children}
      </main>
      <footer className={styles.footer}>
        <Link href="/" className={styles.footerLink}>[ Home ]</Link>
      </footer>
    </div>
  );
}
