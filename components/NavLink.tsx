import styles from './NavLink.module.css';

interface NavLinkProps {
  text: string;
  href?: string;
}

export default function NavLink({ text, href = '#' }: NavLinkProps) {
  return (
    <a href={href} className={`${styles.navLink} nav-link-bg`}>
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
