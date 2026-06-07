import styles from './NavLink.module.css';

interface NavLinkProps {
  text: string;
  href?: string;
  variant?: 'hug' | 'fill';
}

export default function NavLink({ text, href = '#', variant = 'hug' }: NavLinkProps) {
  return (
    <a href={href} className={`${styles.navLink} ${variant === 'fill' ? styles.fill : ''} nav-link-bg`}>
      <span className={`${styles.navLinkText} nav-link-text`}>
        {text.split('').map((char, i) => (
          <span key={i} className="char" style={{ display: 'inline-block' }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
    </a>
  );
}
