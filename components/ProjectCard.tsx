import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  color?: string;
  title?: string;
  onClick?: () => void;
}

export default function ProjectCard({ color, title, onClick }: ProjectCardProps) {
  return (
    <button 
      className={styles.projectCard} 
      type="button"
      style={{ 
        backgroundColor: color || 'var(--color-brand-yellow)', 
        width: '100%',
        height: '100%'
      }}
      onClick={(e) => {
        // Simple click handler
        if (onClick) onClick();
      }}
    >
      {title && (
        <div className={styles.label}>
          <span className={styles.labelText}>{title}</span>
        </div>
      )}
    </button>
  );
}
