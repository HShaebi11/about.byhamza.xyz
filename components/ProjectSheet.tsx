'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './ProjectSheet.module.css';

interface ProjectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  project: any; 
}

export default function ProjectSheet({ isOpen, onClose, project }: ProjectSheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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

  useGSAP(() => {
    if (isOpen) {
      gsap.fromTo('.stagger-item',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, { dependencies: [isOpen], scope: containerRef });

  if (!project && !isOpen) return null;

  const title = project?.title || 'Untitled Project';
  const description = project?.description || 'Something light about this project, like one sentence: the problem, the domains, all that kind of thing. So just one problem to be shared.';

  return (
    <div 
      ref={containerRef}
      className={styles.overlay} 
      onClick={onClose}
      style={{ 
        opacity: isOpen ? 1 : 0, 
        pointerEvents: isOpen ? 'all' : 'none',
        display: isOpen ? 'flex' : 'none'
      }}
    >
      <div 
        className={styles.sheet} 
        onClick={(e) => e.stopPropagation()}
        style={{ 
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className={styles.content}>
          <header className={`${styles.header} stagger-item`}>
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

          <div className={`${styles.mediaSection} stagger-item`}>
            <div className={styles.mediaPlaceholder} />
          </div>

          <div className={`${styles.highlightsGrid} stagger-item`}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.highlightItem}>
                <span className={styles.label}>Description:</span>
                <p className={styles.highlightText}>
                  Something light about this project, like one sentence: the problem, the domains, all that kind of thing.
                </p>
              </div>
            ))}
          </div>

          <div className={`${styles.mediaSectionLarge} stagger-item`}>
             <div className={styles.mediaPlaceholder} />
          </div>
          
          <footer className={`${styles.footer} stagger-item`}>
            <button className={styles.footerButton}>Back / Close</button>
            <button className={styles.footerButton} onClick={onClose}>Next Project</button>
          </footer>
        </div>
      </div>
    </div>
  );
}

