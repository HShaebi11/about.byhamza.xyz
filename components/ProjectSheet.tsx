'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './ProjectSheet.module.css';

interface ProjectSheetProps {
  isOpen: boolean;
  onClose: () => void;
  project: any; // Notion page object
}

export default function ProjectSheet({ isOpen, onClose, project }: ProjectSheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [blocks, setBlocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && project) {
      setLoading(true);
      fetch(`/api/blocks/${project.id}`)
        .then(res => res.json())
        .then(data => {
          setBlocks(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });

      document.body.style.overflow = 'hidden';
      const tl = gsap.timeline();
      tl.to(overlayRef.current, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
      })
      .to(sheetRef.current, {
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.2');
    } else if (!isOpen) {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = '';
          setBlocks([]);
        }
      });
      tl.to(sheetRef.current, {
        y: '100%',
        duration: 0.5,
        ease: 'power3.in',
      })
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      }, '-=0.2');
    }
  }, [isOpen, project]);

  if (!project && !isOpen) return null;

  const title = project?.properties?.Name?.title?.[0]?.plain_text || 'Untitled Project';
  const description = project?.properties?.Description?.rich_text?.[0]?.plain_text || '';

  const renderBlock = (block: any) => {
    switch (block.type) {
      case 'paragraph':
        return <p key={block.id} className={styles.paragraph}>{block.paragraph.rich_text[0]?.plain_text}</p>;
      case 'heading_1':
        return <h1 key={block.id}>{block.heading_1.rich_text[0]?.plain_text}</h1>;
      case 'heading_2':
        return <h2 key={block.id}>{block.heading_2.rich_text[0]?.plain_text}</h2>;
      case 'heading_3':
        return <h3 key={block.id}>{block.heading_3.rich_text[0]?.plain_text}</h3>;
      case 'image':
        const url = block.image.type === 'external' ? block.image.external.url : block.image.file.url;
        return <img key={block.id} src={url} alt="Notion Image" className={styles.blockImage} />;
      default:
        return null;
    }
  };

  return (
    <div 
      ref={overlayRef} 
      className={styles.overlay} 
      onClick={onClose}
      style={{ opacity: 0, pointerEvents: isOpen ? 'all' : 'none' }}
    >
      <div 
        ref={sheetRef} 
        className={styles.sheet} 
        onClick={(e) => e.stopPropagation()}
        style={{ transform: 'translateY(100%)' }}
      >
        <div className={styles.content}>
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <span>Hamza Shaebi</span>
            </div>
            <div className={styles.headerCenter}>
              <div className={styles.projectInfo}>
                <span className={styles.projectLabel}>Project</span>
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

          <div className={styles.mainContent}>
            {loading ? (
              <div className={styles.loading}>Loading content...</div>
            ) : (
              blocks.map(block => renderBlock(block))
            )}
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
