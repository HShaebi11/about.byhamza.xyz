'use client';

import { gsap, useGSAP, Observer, SplitText } from '@/lib/gsap';
import { RefObject, useRef, useCallback, useEffect } from 'react';

export function useGSAPAnimations(
  containerRef: RefObject<HTMLElement | null>,
  isSheetOpen: boolean = false
) {
  const gotoSectionRef = useRef<(index: number, direction?: number) => void>(() => {});
  const isSheetOpenRef = useRef(isSheetOpen);
  const observerRef = useRef<Observer | null>(null);

  useEffect(() => {
    isSheetOpenRef.current = isSheetOpen;
    if (observerRef.current) {
      if (isSheetOpen) {
        observerRef.current.disable();
      } else {
        observerRef.current.enable();
      }
    }
  }, [isSheetOpen]);

  useGSAP(() => {
    if (!containerRef.current) return;

    const sections = gsap.utils.toArray<HTMLElement>('.snap-section');
    if (!sections.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const EASE_OUT = 'power4.out';
    const EASE_IN_OUT = 'expo.inOut';
    const DUR = prefersReducedMotion ? 0 : 0.7;

    // ─── 1. INTRO SECTION ────────────────────────────────────────────────────
    const introTl = gsap.timeline({ paused: true });

    const nameEls = gsap.utils.toArray<HTMLElement>('.intro-name');
    nameEls.forEach((el, i) => {
      const split = SplitText.create(el, { type: 'chars' });
      introTl.from(split.chars, {
        y: 60,
        opacity: 0,
        duration: DUR,
        stagger: 0.04,
        ease: EASE_OUT,
      }, i === 0 ? 0 : '-=0.4');
    });

    const dividers = gsap.utils.toArray<HTMLElement>('.divider-anim');
    if (dividers.length) {
      introTl.from(dividers, {
        clipPath: 'inset(0% 100% 0% 0%)',
        duration: 0.8,
        stagger: 0.2,
        ease: EASE_IN_OUT,
      }, '-=0.6');
    }

    const navLinks = gsap.utils.toArray<HTMLElement>('.intro-nav .nav-link-bg');
    introTl.from(navLinks, {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.5,
      stagger: 0.1,
      ease: EASE_IN_OUT,
    }, '-=0.2');

    const chars = gsap.utils.toArray<HTMLElement>('.intro-nav .char');
    if (chars.length) {
      introTl.from(chars, {
        y: 20,
        opacity: 0,
        duration: 0.35,
        stagger: 0.02,
        ease: EASE_OUT,
      }, '-=0.4');
    }

    introTl.from('.intro-hero-block', {
      scale: 0,
      transformOrigin: 'center center',
      duration: 1.0,
      ease: 'power3.inOut',
    }, '-=0.4');

    // ─── 2. ABOUT SECTION ────────────────────────────────────────────────────
    const aboutTl = gsap.timeline({ paused: true });

    aboutTl.from('.about-bg-block', {
      scale: 0,
      transformOrigin: 'center center',
      duration: 1.0,
      ease: 'power3.inOut',
    });

    const aboutGroups = [
      '.about-anti',
      '.about-design',
      '.about-for',
      '.about-arrows',
      '.about-cultural',
      '.about-practices',
    ];

    aboutGroups.forEach((selector, i) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return;
      const split = SplitText.create(el, { type: 'chars' });
      aboutTl.from(split.chars, {
        y: 60,
        opacity: 0,
        duration: DUR,
        stagger: 0.04,
        ease: EASE_OUT,
      }, i === 0 ? '-=0.2' : '-=0.4');
    });

    // ─── 3. LOCATION SECTION ─────────────────────────────────────────────────
    const locationTl = gsap.timeline({ paused: true });

    locationTl.from('.location-block', {
      scale: 0,
      transformOrigin: 'center center',
      duration: 1.0,
      ease: 'power3.inOut',
    });

    const topGroups = [
      '.location-located',
      '.location-in',
      '.location-bhx',
      '.location-lon'
    ];

    topGroups.forEach((selector, i) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return;
      const split = SplitText.create(el, { type: 'chars' });
      locationTl.from(split.chars, {
        y: 60,
        opacity: 0,
        duration: DUR,
        stagger: 0.04,
        ease: EASE_OUT,
      }, i === 0 ? '-=0.6' : '-=0.4');
    });

    const bottomGroups = [
      '.location-available',
      '.location-world'
    ];

    bottomGroups.forEach((selector, i) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return;
      const split = SplitText.create(el, { type: 'chars' });
      locationTl.from(split.chars, {
        y: 60,
        opacity: 0,
        duration: DUR,
        stagger: 0.04,
        ease: EASE_OUT,
      }, '-=0.4');
    });

    // ─── 4. WORK SECTION ─────────────────────────────────────────────────────
    const workTl = gsap.timeline({ paused: true });

    const workTitleEl = document.querySelector<HTMLElement>('.work-title');
    if (workTitleEl) {
      const workSplit = SplitText.create(workTitleEl, { type: 'chars' });
      workTl.from(workSplit.chars, {
        y: 60,
        opacity: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: EASE_OUT,
      });
    }

    const countEl = document.querySelector<HTMLElement>('.work-count');
    if (countEl) {
      const finalCount = parseInt(countEl.getAttribute('data-count') || '4', 10);
      const counter = { val: 1 };
      workTl.to(counter, {
        val: finalCount,
        duration: 0.8,
        ease: 'power2.out',
        snap: { val: 1 },
        onUpdate: () => {
          countEl.textContent = `[${counter.val}]`;
        },
      }, '<0.2');
    }

    const cards = gsap.utils.toArray<HTMLElement>('.work-card');
    workTl.from(cards, {
      y: 80,
      opacity: 0,
      scale: 0.94,
      duration: 0.6,
      stagger: 0.12,
      ease: EASE_OUT,
    }, '-=0.3');

    // ─── 5. PROCESS SECTION ──────────────────────────────────────────────────
    const processTl = gsap.timeline({ paused: true });

    const processLabelEl = document.querySelector<HTMLElement>('.process-label');
    if (processLabelEl) {
      const split = SplitText.create(processLabelEl, { type: 'chars' });
      processTl.from(split.chars, {
        y: 60,
        opacity: 0,
        duration: DUR,
        stagger: 0.04,
        ease: EASE_OUT,
      });
    }

    processTl.from('.process-square', {
      scale: 0,
      transformOrigin: 'center center',
      duration: 1.0,
      ease: 'power3.inOut',
    }, '-=0.4');

    const processGroups = [
      '.process-concept',
      '.process-build',
      '.process-ship',
    ];

    processGroups.forEach((selector, i) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return;
      const split = SplitText.create(el, { type: 'chars' });
      processTl.from(split.chars, {
        y: 60,
        opacity: 0,
        duration: DUR,
        stagger: 0.04,
        ease: EASE_OUT,
      }, i === 0 ? '-=0.6' : '-=0.4');
    });

    // ─── 6. FOOTER CTA ───────────────────────────────────────────────────────
    const footerTl = gsap.timeline({ paused: true });

    const ctaEl = document.querySelector<HTMLElement>('.cta-text');
    if (ctaEl) {
      const split = SplitText.create(ctaEl, { type: 'chars' });
      footerTl.from(split.chars, {
        y: 80,
        opacity: 0,
        duration: 0.7,
        stagger: 0.04,
        ease: EASE_OUT,
      });
    }

    footerTl.from('.orange-highlight', {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 0.6,
      ease: EASE_IN_OUT,
    }, '-=0.2');

    const sectionTls = [introTl, aboutTl, locationTl, workTl, processTl, footerTl];

    // ─── INFINITE CONTINUOUS SECTION LOOPING ─────────────────────────────────
    const wrap = gsap.utils.wrap(0, sections.length);
    let currentIndex = 0;
    let animating = false;
    let lastTransitionTime = 0;

    // Check for hash on mount (#work -> 3, #process -> 4)
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#work') currentIndex = 3;
      else if (window.location.hash === '#process') currentIndex = 4;
    }

    // Set initial positions: active section visible at 0%, all others hidden
    gsap.set(sections, { yPercent: 100, autoAlpha: 0, zIndex: 0 });
    gsap.set(sections[currentIndex], { yPercent: 0, autoAlpha: 1, zIndex: 1 });
    sectionTls[currentIndex]?.play();

    const gotoSection = (index: number, direction?: number) => {
      const now = Date.now();
      if (animating || (now - lastTransitionTime < 650)) return;

      const targetIndex = wrap(index);
      if (targetIndex === currentIndex) return;

      if (direction === undefined) {
        const diff = (targetIndex - currentIndex + sections.length) % sections.length;
        direction = diff <= sections.length / 2 ? 1 : -1;
      }

      animating = true;
      lastTransitionTime = now;

      const prevIndex = currentIndex;
      const currentSection = sections[prevIndex];
      const nextSection = sections[targetIndex];

      // Prepare next section in the direction of motion
      gsap.set(sections, { zIndex: 0 });
      gsap.set(currentSection, { zIndex: 1 });
      gsap.set(nextSection, {
        zIndex: 2,
        autoAlpha: 1,
        yPercent: direction * 100,
      });

      const transitionDuration = prefersReducedMotion ? 0.1 : 0.85;

      const transitionTl = gsap.timeline({
        defaults: { duration: transitionDuration, ease: 'power2.inOut' },
        onComplete: () => {
          gsap.set(currentSection, { autoAlpha: 0, zIndex: 0 });
          gsap.set(nextSection, { zIndex: 1 });
          currentIndex = targetIndex;

          // Reset previous section's timeline so it's ready to replay
          sectionTls[prevIndex]?.progress(0).pause();

          // Small cooldown to prevent rapid trackpad inertia from skipping
          setTimeout(() => {
            animating = false;
          }, 150);
        },
      });

      // Slide out current section and slide in next section simultaneously
      transitionTl
        .to(currentSection, { yPercent: -direction * 100 }, 0)
        .to(nextSection, { yPercent: 0 }, 0);

      // Replay incoming section entrance animation
      sectionTls[targetIndex]?.restart();

      // Update URL hash cleanly
      if (typeof window !== 'undefined') {
        if (targetIndex === 3) {
          window.history.replaceState(null, '', '#work');
        } else if (targetIndex === 4) {
          window.history.replaceState(null, '', '#process');
        } else if (targetIndex === 0 && window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    gotoSectionRef.current = gotoSection;

    // Observer intercepts wheel and touch gestures seamlessly
    const observer = Observer.create({
      target: window,
      type: 'wheel,touch',
      wheelSpeed: -1,
      tolerance: 20,
      preventDefault: true,
      onUp: () => {
        if (!animating && !isSheetOpenRef.current) {
          gotoSection(currentIndex + 1, 1);
        }
      },
      onDown: () => {
        if (!animating && !isSheetOpenRef.current) {
          gotoSection(currentIndex - 1, -1);
        }
      },
    });

    observerRef.current = observer;

    // Keyboard navigation (ArrowDown, ArrowUp, PageDown, PageUp, Space)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSheetOpenRef.current) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        gotoSection(currentIndex + 1, 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        gotoSection(currentIndex - 1, -1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        gotoSection(0, -1);
      } else if (e.key === 'End') {
        e.preventDefault();
        gotoSection(sections.length - 1, 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      observer.kill();
      sectionTls.forEach((tl) => tl.kill());
    };
  }, { scope: containerRef });

  const gotoSection = useCallback((index: number, direction?: number) => {
    gotoSectionRef.current(index, direction);
  }, []);

  return { gotoSection };
}
