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

    // 1. INTRO — plays on mount, no ScrollTrigger needed
    const introTl = gsap.timeline({ paused: true });
    const nameEls = gsap.utils.toArray<HTMLElement>('.intro-name');
    introTl.from(nameEls, { y: -120, opacity: 0, skewY: -8, duration: DUR, stagger: 0.12, ease: EASE_OUT });
    const navLinks = gsap.utils.toArray<HTMLElement>('.intro-nav a, .intro-nav button');
    introTl.from(navLinks, { y: 40, opacity: 0, duration: 0.5, stagger: 0.08, ease: EASE_OUT }, '-=0.4');
    introTl.from('.intro-hero-block', { clipPath: 'inset(100% 0% 0% 0% round 15px)', duration: 0.9, ease: EASE_IN_OUT }, '-=0.3');
    introTl.play();

    // 2. ABOUT
    const aboutTl = gsap.timeline({ paused: true });
    aboutTl.from('.about-bg-block', { scale: 0.7, opacity: 0, duration: 0.6, ease: EASE_OUT });
    aboutTl.from('.about-anti', { x: -100, opacity: 0, duration: DUR, ease: EASE_OUT }, '-=0.3');
    aboutTl.from('.about-design', { x: 100, opacity: 0, duration: DUR, ease: EASE_OUT }, '<');
    aboutTl.from('.about-for', { y: 60, opacity: 0, duration: 0.5, ease: EASE_OUT }, '-=0.2');
    aboutTl.from('.about-arrows', { scale: 0, opacity: 0, rotation: -180, duration: 0.6, ease: 'back.out(2)' }, '<');
    aboutTl.from('.about-cultural', { x: -80, opacity: 0, duration: DUR, ease: EASE_OUT }, '-=0.2');
    aboutTl.from('.about-practices', { x: 80, opacity: 0, duration: DUR, ease: EASE_OUT }, '<');
    ScrollTrigger.create({ trigger: '.section-about', start: 'top center', onEnter: () => aboutTl.play(), onLeaveBack: () => aboutTl.reverse() });

    // 3. LOCATION
    const locationTl = gsap.timeline({ paused: true });
    locationTl.from('.location-block', { clipPath: 'inset(0% 100% 0% 0% round 20px)', duration: 1.0, ease: EASE_IN_OUT });
    locationTl.from('.location-located', { x: -150, opacity: 0, duration: DUR, ease: EASE_OUT }, '-=0.5');
    locationTl.from('.location-bhx', { x: 100, opacity: 0, duration: 0.5, ease: EASE_OUT }, '<');
    locationTl.from('.location-lon', { x: 120, opacity: 0, duration: 0.5, ease: EASE_OUT }, '<0.08');
    locationTl.from('.location-available', { y: 80, opacity: 0, duration: DUR, ease: EASE_OUT }, '-=0.2');
    locationTl.from('.location-world', { y: 80, opacity: 0, duration: DUR, ease: EASE_OUT }, '<0.1');
    ScrollTrigger.create({ trigger: '.section-location', start: 'top center', onEnter: () => locationTl.play(), onLeaveBack: () => locationTl.reverse() });

    // 4. WORK
    const workTl = gsap.timeline({ paused: true });
    workTl.from('.work-title', { x: -80, opacity: 0, duration: DUR, ease: EASE_OUT });
    workTl.from('.work-count', { x: 80, opacity: 0, duration: DUR, ease: EASE_OUT }, '<');
    const cards = gsap.utils.toArray<HTMLElement>('.work-card');
    workTl.from(cards, { y: 80, opacity: 0, scale: 0.92, duration: 0.65, stagger: 0.1, ease: EASE_OUT }, '-=0.3');
    ScrollTrigger.create({ trigger: '.section-work', start: 'top center', onEnter: () => workTl.play(), onLeaveBack: () => workTl.reverse() });

    // 5. PROCESS
    const processTl = gsap.timeline({ paused: true });
    processTl.from('.process-label', { y: -60, opacity: 0, duration: DUR, ease: EASE_OUT });
    processTl.from('.process-concept', { x: 100, opacity: 0, duration: DUR, ease: EASE_OUT }, '<0.1');
    processTl.from('.process-square', { scale: 0, rotation: 45, opacity: 0, duration: 0.8, ease: 'back.out(1.4)' }, '-=0.3');
    processTl.from('.process-build', { x: -80, y: 30, opacity: 0, duration: DUR, ease: EASE_OUT }, '-=0.3');
    processTl.from('.process-ship', { x: 80, y: 30, opacity: 0, duration: DUR, ease: EASE_OUT }, '<');
    ScrollTrigger.create({ trigger: '.section-process', start: 'top center', onEnter: () => processTl.play(), onLeaveBack: () => processTl.reverse() });

    // 6. FOOTER
    const footerTl = gsap.timeline({ paused: true });
    const ctaEl = document.querySelector<HTMLElement>('.cta-text');
    if (ctaEl) {
      const split = SplitText.create(ctaEl, { type: 'chars,words' });
      footerTl.from(split.chars, { y: 120, opacity: 0, rotation: gsap.utils.wrap([-8, 8]), duration: 0.6, stagger: 0.025, ease: EASE_OUT });
    }
    footerTl.from('.orange-highlight', { scaleX: 0, transformOrigin: 'left center', duration: 0.4, ease: EASE_IN_OUT }, '-=0.3');
    ScrollTrigger.create({ trigger: '.section-footer', start: 'top center', onEnter: () => footerTl.play(), onLeaveBack: () => footerTl.reverse() });

  }, { scope: containerRef });
}
