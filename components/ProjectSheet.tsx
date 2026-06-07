'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './ProjectSheet.module.css';

interface ProjectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  project: any; 
}

export default function ProjectSheet({ isOpen, onClose, project }: ProjectSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useLayoutEffect(() => {
    // Initial state: Hidden
    if (isInitialMount.current) {
      gsap.set(overlayRef.current, { visibility: 'hidden', opacity: 0 });
      gsap.set(sheetRef.current, { yPercent: 100 });
      isInitialMount.current = false;
      return;
    }

    if (isOpen) {
      // Lock scroll
      const scrollY = window.scrollY;
      document.body.style.top = `-${scrollY}px`;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // Animate In
      const tl = gsap.timeline();
      tl.set(overlayRef.current, { visibility: 'visible' })
        .to(overlayRef.current, { 
          opacity: 1, 
          duration: 0.3, 
          ease: 'power2.out' 
        })
        .to(sheetRef.current, { 
          yPercent: 0, 
          duration: 0.6, 
          ease: 'power3.out' 
        }, '-=0.2');
    } else {
      // Animate Out
      const tl = gsap.timeline({
        onComplete: () => {
          // Unlock scroll
          const scrollY = document.body.style.top;
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          document.body.style.overflow = '';
          if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
          }
          gsap.set(overlayRef.current, { visibility: 'hidden' });
        }
      });

      tl.to(sheetRef.current, { 
        yPercent: 100, 
        duration: 0.5, 
        ease: 'power3.in' 
      })
      .to(overlayRef.current, { 
        opacity: 0, 
        duration: 0.3, 
        ease: 'power2.in' 
      }, '-=0.3');
    }
  }, [isOpen]);

  const title = project?.title || 'Untitled Project';
  const description = project?.description || 'Something light about this project, like one sentence: the problem, the domains, all that kind of thing. So just one problem to be shared.';

  return (
    <div 
      ref={overlayRef} 
      className={styles.overlay} 
      onClick={onClose}
      style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
    >
      <div 
        ref={sheetRef} 
        className={styles.sheet} 
        onClick={(e) => e.stopPropagation()}
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
            <button className={styles.footerButton} onClick={onClose}>Back / Close</button>
            <button className={styles.footerButton} onClick={onClose}>Next Project</button>
          </footer>
        </div>
      </div>
    </div>
  );
}
