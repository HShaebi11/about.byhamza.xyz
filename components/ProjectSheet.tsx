'use client';

import { useEffect } from 'react';
import styles from './ProjectSheet.module.css';

interface ProjectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  project: any; 
}

export default function ProjectSheet({ isOpen, onClose, project }: ProjectSheetProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!project && !isOpen) return null;

  const title = project?.title || 'Untitled Project';
  const description = project?.description || 'Something light about this project, like one sentence: the problem, the domains, all that kind of thing. So just one problem to be shared.';

  return (
    <div 
      className={styles.overlay} 
      onClick={onClose}
      style={{ display: isOpen ? 'flex' : 'none' }}
    >
      <div className={styles.overlayBackdrop} aria-hidden="true" />
      <div 
        className={styles.sheet} 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          transform: isOpen ? 'translateY(0)' : 'translateY(calc(100% + env(safe-area-inset-bottom) + 72px))'
        }}
      >
        <div className={styles.content}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <span>Hamza Shaebi</span>
            </div>
            <div className={styles.headerCenter}>
              <div className={styles.projectInfo}>
                <span className={styles.projectLabel}>Project {project?.id || '01'}</span>
                <h1 className={styles.projectName}>{title}</h1>
              </div>
              <div className={styles.descriptionContainer}>
                <span className={styles.label}>Description:</span>
                <p className={styles.descriptionText}>{description}</p>
              </div>
            </div>
            <div className={styles.headerRight}>
              <button onClick={onClose} className={styles.closeButton}>
                Close / Home
              </button>
            </div>
          </header>

          <div className={styles.mediaSection}>
            <div className={styles.mediaPlaceholder} />
          </div>

          <div className={styles.highlightsGrid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.highlightItem}>
                <span className={styles.label}>Description:</span>
                <p className={styles.highlightText}>
                  Something light about this project, like one sentence: the problem, the domains, all that kind of thing.
                </p>
              </div>
            ))}
          </div>

          <div className={styles.mediaSectionLarge}>
             <div className={styles.mediaPlaceholder} />
          </div>
          
          <footer className={styles.footer}>
            <button className={styles.footerButton}>Back / Close</button>
            <button className={styles.footerButton} onClick={onClose}>Next Project</button>
          </footer>
        </div>
      </div>
    </div>
  );
}
