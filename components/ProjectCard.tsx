import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  color?: string;
  title?: string;
  onClick?: () => void;
}

export default function ProjectCard({ color, title, onClick }: ProjectCardProps) {
  return (
    <div 
      className={styles.projectCard} 
      style={color ? { backgroundColor: color } : {}}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {title && (
        <div className={styles.label}>
          <span className={styles.labelText}>{title}</span>
        </div>
      )}
    </div>
  );
}
