import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  color?: string;
  title?: string;
}

export default function ProjectCard({ color, title }: ProjectCardProps) {
  return (
    <div 
      className={styles.projectCard} 
      style={color ? { backgroundColor: color } : {}}
    >
      {title && (
        <div className={styles.label}>
          <span className={styles.labelText}>{title}</span>
        </div>
      )}
    </div>
  );
}
