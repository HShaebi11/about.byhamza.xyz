'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, SplitText } from '@/lib/gsap';
import styles from './ProjectSheet.module.css';

interface ProjectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  project: any; 
  originRect?: DOMRect | null;
}

export default function ProjectSheet({ isOpen, onClose, onNext, onPrev, project }: ProjectSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (sheetRef.current) {
      sheetRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [project]);

  // GSAP Animation Logic (useLayoutEffect prevents 1-frame flicker on mount)
  useLayoutEffect(() => {
    if (!sheetRef.current || !titleRef.current) return;
    
    const sheet = sheetRef.current;
    
    // Use the native SplitText exactly like the home page
    const splitInstance = SplitText.create(titleRef.current, { type: 'chars' });
    const titleLetters = splitInstance.chars;
    
    // Fine-grained DOM selection
    const headerItems = sheet.querySelectorAll(`.${styles.macButtons}, .${styles.windowTitle}, .${styles.closeButton}`);
    const line = sheet.querySelectorAll(`.${styles.topBarLine}`);
    const tags = sheet.querySelectorAll(`.${styles.projectLabel}`);
    const otherElements = sheet.querySelectorAll(`.${styles.metadataGrid}, .${styles.descriptionLarge}, .${styles.heroMedia}, .${styles.detailsSection}, .${styles.mediaGrid}, .${styles.footer}`);

    if (isOpen) {
      setShouldRender(true);
      document.body.style.overflow = 'hidden';

      const tl = gsap.timeline();
      
      // Setup initial state
      gsap.set(sheet, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 1 });
      gsap.set(headerItems, { opacity: 0 });
      gsap.set(line, { scaleX: 0 });
      gsap.set(tags, { opacity: 0, y: 10 });
      gsap.set(titleLetters, { y: 60, opacity: 0 }); // Match home page styling: y: 60, opacity: 0
      gsap.set(otherElements, { opacity: 0, y: 20 });

      // 1. Masking expands from top to bottom
      tl.to(sheet, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.6,
        ease: "expo.inOut"
      });

      // 2. Header fades in
      tl.to(headerItems, {
        opacity: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: "power2.out"
      }, "-=0.1");

      // 4. Line draws out
      tl.to(line, {
        scaleX: 1,
        duration: 0.6,
        ease: "expo.out"
      }, "-=0.2");

      // 5. Tags appear
      tl.to(tags, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.4");

      // 6. Project name staggers in perfectly (matching home page)
      tl.to(titleLetters, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.04,
        ease: "power4.out"
      }, "-=0.2");

      // 7. Other elements slide in
      tl.to(otherElements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.06,
        ease: "power2.out"
      }, "-=0.4");

    } else {
      document.body.style.overflow = '';
      setIsMaximized(false);

      if (!shouldRender) return;

      const tl = gsap.timeline({
        onComplete: () => {
          setShouldRender(false);
          gsap.set(sheet, { clearProps: "all" });
          gsap.set([headerItems, line, tags, titleLetters, otherElements], { clearProps: "all" });
          splitInstance.revert(); // clean up SplitText instance on close
        }
      });

      // Fast, clean stagger out sequence
      tl.to([otherElements, titleLetters, tags, headerItems], {
        opacity: 0,
        y: -10,
        duration: 0.3,
        stagger: 0.01,
        ease: "power2.in"
      });

      tl.to(line, {
        scaleX: 0,
        duration: 0.3,
        ease: "power2.inOut"
      }, "<");

      tl.to(sheet, {
        clipPath: 'inset(0% 0% 100% 0%)', // Hides from bottom to top
        duration: 0.5,
        ease: "expo.inOut"
      });
    }
    
    // Cleanup split text when component unmounts if open
    return () => {
      splitInstance.revert();
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!project && !shouldRender) return null;

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMaximized(!isMaximized);
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const title = project?.title || 'Untitled Project';
  const description = project?.description || 'Something light about this project, like one sentence: the problem, the domains, all that kind of thing. So just one problem to be shared.';

  const sheetStyles: React.CSSProperties = {};

  if (isMaximized) {
    sheetStyles.width = '100%';
    sheetStyles.height = '100vh';
    sheetStyles.margin = '0';
    sheetStyles.borderRadius = '0';
  }

  return (
    <div 
      className={styles.overlay} 
      onClick={onClose}
      style={{ display: shouldRender ? 'flex' : 'none' }}
    >
      <div 
        ref={sheetRef}
        className={styles.sheet} 
        onClick={(e) => e.stopPropagation()}
        style={sheetStyles}
      >
        <div className={styles.content}>
          <div className={styles.topBar}>
            <div className={styles.macButtons}>
              <button className={`${styles.macButton} ${styles.macClose}`} onClick={handleClose} aria-label="Close" />
              <button className={`${styles.macButton} ${styles.macMinimize}`} onClick={handleClose} aria-label="Minimize" />
              <button className={`${styles.macButton} ${styles.macMaximize}`} onClick={handleMaximize} aria-label="Maximize" />
            </div>
            <span className={styles.windowTitle}>Hamza Shaebi</span>
            <button onClick={onClose} className={styles.closeButton}>
              [ Close ]
            </button>
            <div className={styles.topBarLine}></div>
          </div>

          <div className={styles.heroSection}>
            <div className={styles.heroHeader}>
              <span className={styles.projectLabel}>NO. {project?.id || '01'}</span>
              <h1 className={styles.projectNameLarge} ref={titleRef}>{title}</h1>
            </div>

            <div className={styles.metadataGrid}>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Role</span>
                <span>Design Engineer</span>
              </div>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Year</span>
                <span>2024</span>
              </div>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Client</span>
                <span>Internal Exploration</span>
              </div>
              <div className={styles.metadataItem}>
                <span className={styles.metadataLabel}>Status</span>
                <span>Live</span>
              </div>
            </div>

            <p className={styles.descriptionLarge}>{description}</p>
          </div>

          <div className={styles.heroMedia}>
            <div className={styles.mediaPlaceholderFull}>16:9 MEDIA BLOCK</div>
          </div>

          <div className={styles.detailsSection}>
            <h3 className={styles.detailsHeading}>The Challenge</h3>
            <div className={styles.detailsContent}>
              <p className={styles.detailsText}>
                Crafting a seamless experience that bridges the gap between complex functionality and minimalistic design. 
                The goal was to create an interface that feels invisible, allowing the content to take center stage while 
                maintaining a strong, distinct brand identity.
              </p>
              <p className={styles.detailsText}>
                Through meticulous attention to typography, spacing, and micro-interactions, we developed a system 
                that scales elegantly across devices. Later, this will be connected to a CMS.
              </p>
            </div>
          </div>

          <div className={styles.mediaGrid}>
            <div className={styles.mediaPlaceholderSquare}>4:5 MEDIA BLOCK</div>
            <div className={styles.mediaPlaceholderSquare}>4:5 MEDIA BLOCK</div>
          </div>

          <div className={styles.heroMedia}>
            <div className={styles.mediaPlaceholderFull}>16:9 MEDIA BLOCK</div>
          </div>
          
          <footer className={styles.footer}>
            <button className={styles.footerButtonNext} onClick={onPrev}>&larr; Prev</button>
            <button className={styles.footerButton} onClick={onClose}>[ Home ]</button>
            <button className={styles.footerButtonNext} onClick={onNext}>Next &rarr;</button>
          </footer>
        </div>
      </div>
    </div>
  );
}
