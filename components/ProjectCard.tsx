'use client';

import { useCallback, useEffect, useRef } from 'react';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  id?: string;
  color?: string;
  title?: string;
  className?: string;
  onClick?: () => void;
}

const TAP_THRESHOLD_PX = 12;

export default function ProjectCard({ id, color, title, className, onClick }: ProjectCardProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const touchHandled = useRef(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || !onClick) return;

    let startX = 0;
    let startY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      startX = touch.clientX;
      startY = touch.clientY;
      touchHandled.current = false;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      const touch = event.changedTouches[0];
      if (!touch) return;

      const dx = Math.abs(touch.clientX - startX);
      const dy = Math.abs(touch.clientY - startY);

      if (dx <= TAP_THRESHOLD_PX && dy <= TAP_THRESHOLD_PX) {
        event.preventDefault();
        touchHandled.current = true;
        onClick();
      }
    };

    button.addEventListener('touchstart', handleTouchStart, { passive: true });
    button.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      button.removeEventListener('touchstart', handleTouchStart);
      button.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onClick]);

  const handleClick = useCallback(() => {
    if (touchHandled.current) {
      touchHandled.current = false;
      return;
    }
    onClick?.();
  }, [onClick]);

  return (
    <button
      id={id}
      ref={buttonRef}
      type="button"
      className={[styles.projectCard, className].filter(Boolean).join(' ')}
      style={color ? { backgroundColor: color } : undefined}
      onClick={handleClick}
      aria-label={title}
    >
      {title && (
        <span className={styles.label}>
          <span className={styles.labelText}>{title}</span>
        </span>
      )}
    </button>
  );
}
