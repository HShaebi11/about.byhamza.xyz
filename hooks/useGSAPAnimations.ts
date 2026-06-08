'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { RefObject } from 'react';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function useGSAPAnimations(containerRef: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    if (!containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const EASE_OUT = 'power4.out';
    const EASE_IN_OUT = 'expo.inOut';
    const DUR = 0.7;

    // ─── 1. INTRO SECTION ────────────────────────────────────────────────────
    const introTl = gsap.timeline({ paused: true });

    // HAMZA / SHAEBI — SplitText chars slide up from y:60
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

    // Nav links — background scaleX wipe left→right, sequential per link
    const navLinks = gsap.utils.toArray<HTMLElement>('.intro-nav .nav-link-bg');
    navLinks.forEach((link, i) => {
      introTl.from(link, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.5,
        ease: EASE_IN_OUT,
      }, `-=${i === 0 ? 0.2 : -0.1}`);
      const chars = link.querySelectorAll<HTMLElement>('.char');
      if (chars.length) {
        introTl.from(chars, {
          y: 20,
          opacity: 0,
          duration: 0.35,
          stagger: 0.03,
          ease: EASE_OUT,
        }, '-=0.2');
      }
    });

    // Hero blue block — clip-path wipe upward
    introTl.from('.intro-hero-block', {
      clipPath: 'inset(100% 0% 0% 0% round 15px)',
      duration: 1.0,
      ease: EASE_IN_OUT,
    }, '-=0.4');

    introTl.play();

    // ─── 2. ABOUT SECTION ────────────────────────────────────────────────────
    const aboutTl = gsap.timeline({ paused: true });

    aboutTl.from('.about-bg-block', {
      scale: 0.7,
      opacity: 0,
      duration: 0.6,
      ease: EASE_OUT,
    });

    const aboutGroups: Array<{ selector: string; fromX?: number; fromY?: number }> = [
      { selector: '.about-anti',      fromX: -80 },
      { selector: '.about-design',    fromX: 80 },
      { selector: '.about-for',       fromY: 60 },
      { selector: '.about-arrows',    fromY: -60 },
      { selector: '.about-cultural',  fromX: -80 },
      { selector: '.about-practices', fromX: 80 },
    ];

    aboutGroups.forEach(({ selector, fromX, fromY }, i) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return;
      const split = SplitText.create(el, { type: 'chars' });
      aboutTl.from(split.chars, {
        x: fromX ? gsap.utils.wrap([fromX, fromX * 0.5, fromX * 1.5]) : 0,
        y: fromY ? gsap.utils.wrap([fromY, fromY * 0.5, fromY * 1.5]) : gsap.utils.wrap([-30, 30]),
        opacity: 0,
        rotation: gsap.utils.wrap([-12, 12, -6, 6]),
        duration: 0.55,
        stagger: 0.035,
        ease: EASE_OUT,
      }, i === 0 ? '-=0.2' : '-=0.3');
    });

    ScrollTrigger.create({
      trigger: '.section-about',
      start: 'top center',
      onEnter: () => aboutTl.play(),
      onLeaveBack: () => aboutTl.reverse(),
    });

    // ─── 3. LOCATION SECTION ─────────────────────────────────────────────────
    const locationTl = gsap.timeline({ paused: true });

    locationTl.from('.location-block', {
      scale: 0,
      opacity: 0,
      transformOrigin: 'center center',
      duration: 0.8,
      ease: 'back.out(1.2)',
    });

    locationTl.from('.location-located', {
      y: 60,
      opacity: 0,
      duration: DUR,
      ease: EASE_OUT,
    }, '-=0.4');

    const bhxEl = document.querySelector<HTMLElement>('.location-bhx');
    if (bhxEl) {
      const bhxSplit = SplitText.create(bhxEl, { type: 'chars' });
      locationTl.from(bhxSplit.chars, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.08,
        ease: EASE_OUT,
      }, '-=0.3');
    }

    const lonEl = document.querySelector<HTMLElement>('.location-lon');
    if (lonEl) {
      const lonSplit = SplitText.create(lonEl, { type: 'chars' });
      locationTl.from(lonSplit.chars, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.08,
        ease: EASE_OUT,
      }, '-=0.1');
    }

    locationTl.from('.location-available', {
      y: 80,
      opacity: 0,
      duration: DUR,
      ease: EASE_OUT,
    }, '-=0.2');
    locationTl.from('.location-world', {
      y: 80,
      opacity: 0,
      duration: DUR,
      ease: EASE_OUT,
    }, '<0.1');

    ScrollTrigger.create({
      trigger: '.section-location',
      start: 'top center',
      onEnter: () => locationTl.play(),
      onLeaveBack: () => locationTl.reverse(),
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

    ScrollTrigger.create({
      trigger: '.section-work',
      start: 'top center',
      onEnter: () => workTl.play(),
      onLeaveBack: () => workTl.reverse(),
    });

    // ─── 5. PROCESS SECTION ──────────────────────────────────────────────────
    const processTl = gsap.timeline({ paused: true });

    processTl.from('.process-square', {
      scale: 0,
      opacity: 0,
      duration: 0.7,
      ease: 'back.out(1.7)',
    });
    processTl.to('.process-square', {
      scale: 1,
      duration: 0.15,
      ease: 'power2.inOut',
    });

    const processGroups = [
      { selector: '.process-label',   fromY: -60 },
      { selector: '.process-concept', fromX: 80 },
      { selector: '.process-build',   fromX: -80, fromY: 30 },
      { selector: '.process-ship',    fromX: 80,  fromY: 30 },
    ];

    processGroups.forEach(({ selector, fromX, fromY }, i) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (!el) return;
      const split = SplitText.create(el, { type: 'chars' });
      processTl.from(split.chars, {
        x: fromX ?? 0,
        y: fromY ?? 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: EASE_OUT,
      }, i === 0 ? '-=0.1' : '-=0.3');
    });

    ScrollTrigger.create({
      trigger: '.section-process',
      start: 'top center',
      onEnter: () => processTl.play(),
      onLeaveBack: () => processTl.reverse(),
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

    ScrollTrigger.create({
      trigger: '.section-footer',
      start: 'top center',
      onEnter: () => footerTl.play(),
      onLeaveBack: () => footerTl.reverse(),
    });

  }, { scope: containerRef });
}
