'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { Observer } from 'gsap/Observer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Divider from '@/components/Divider';
import NavLink from '@/components/NavLink';
import ProjectCard from '@/components/ProjectCard';
import styles from './page.module.css';

gsap.registerPlugin(ScrollToPlugin, Observer, ScrollTrigger);

// Safari/Mobile Optimizations
if (typeof window !== "undefined") {
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollTrigger.normalizeScroll(true);
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentIndex = useRef(0);
  const animating = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Initial Intro Timeline
      const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      introTl
        .from(".name-char", {
          opacity: 0,
          y: 40,
          stagger: 0.03,
          duration: 0.8,
        })
        .from(".divider-anim", {
          scaleX: 0,
          transformOrigin: "left",
          duration: 0.8,
          stagger: 0.1,
        }, "-=0.8")
        .from(".nav-link-bg", {
          scaleX: 0,
          transformOrigin: "left",
          stagger: 0.1,
          duration: 0.6,
        }, "-=0.6")
        .from(".nav-link-text .char", {
          opacity: 0,
          y: 10,
          stagger: 0.02,
          duration: 0.4,
        }, "-=0.4")
        .from(".hero-rect", {
          scale: 0,
          duration: 0.8,
          ease: "power3.out",
        }, "-=0.6");

      // 2. Section Timelines with ScrollTrigger
      
      // About Section
      const aboutTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 70%",
          toggleActions: "restart none none none",
        }
      });
      aboutTl
        .from(".about-rect", {
          scale: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .from(".about-text-char", {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.8");

      // Location Section
      const locationTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".location-section",
          start: "top 70%",
          toggleActions: "restart none none none",
        }
      });
      locationTl
        .from(".location-rect", {
          scale: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .from(".posLocated .location-text-char", {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.8")
        .from(".posBHX .location-text-char", {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.4")
        .from(".posLON .location-text-char", {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.4")
        .from(".posAvailable .location-text-char", {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.4")
        .from(".posWorld .location-text-char", {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.4");

      // Work Section
      const workTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-section",
          start: "top 70%",
          toggleActions: "restart none none none",
        }
      });

      const workCount = { val: 1 };
      workTl
        .from(".work-text-char", {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.6,
        })
        .from(".project-card-anim", {
          opacity: 0,
          y: 40,
          stagger: window.innerWidth <= 768 ? 0.3 : 0.1,
          duration: 0.8,
          ease: "power2.out"
        }, "-=0.4")
        .to(workCount, {
          val: 4,
          duration: 2,
          ease: "power2.inOut",
          onUpdate: () => {
            const countEl = document.querySelector(".work-count");
            if (countEl) countEl.textContent = `[${Math.floor(workCount.val)}]`;
          }
        }, "-=1.5");

      // Process Section
      const processTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".process-section",
          start: "top 70%",
          toggleActions: "restart none none none",
        }
      });
      processTl
        .from(".process-rect", {
          scale: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .from(".process-text-char", {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.6,
          ease: "power2.out"
        }, "-=0.8");

      // Footer Section
      gsap.from(".cta-text-char", {
        scrollTrigger: {
          trigger: ".footer-section",
          start: "top 70%",
          toggleActions: "restart none none none",
        },
        opacity: 0,
        y: 20,
        stagger: 0.02,
        duration: 0.8,
        ease: "power3.out",
      });

      // Snapping Logic (Existing)
      const sections = gsap.utils.toArray('.snap-section') as HTMLElement[];
      sections.forEach((section, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onEnter: () => { if (!animating.current) currentIndex.current = i; },
          onEnterBack: () => { if (!animating.current) currentIndex.current = i; }
        });
      });

      const gotoSection = (index: number) => {
        index = gsap.utils.clamp(0, sections.length - 1, index);
        if (animating.current || index === currentIndex.current) return;
        animating.current = true;
        gsap.to(window, {
          scrollTo: { y: sections[index], autoKill: false },
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            currentIndex.current = index;
            setTimeout(() => { animating.current = false; }, 100);
          }
        });
      };

      const scrollObserver = Observer.create({
        type: "wheel,touch,keyboard",
        onDown: () => !animating.current && gotoSection(currentIndex.current + 1),
        onUp: () => !animating.current && gotoSection(currentIndex.current - 1),
        tolerance: 20,
        preventDefault: true
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const splitText = (text: string, charClass: string = "name-char") => {
    return text.split('').map((char, i) => (
      <span key={i} className={charClass} style={{ display: 'inline-block' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const StaggerText = ({ text, className, charClass }: { text: string, className?: string, charClass: string }) => {
    const lines = text.split('\n');
    return (
      <div className={className}>
        {lines.map((line, lineIndex) => (
          <span key={lineIndex} style={{ display: 'block', textAlign: 'inherit' }}>
            {line.split('').map((char, charIndex) => (
              <span key={charIndex} className={charClass} style={{ display: 'inline-block' }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </span>
        ))}
      </div>
    );
  };

  return (
    <main className={styles.main} ref={containerRef}>
      {/* Intro Section */}
      <section className={`${styles.introSection} snap-section`}>
        <header className={styles.header}>
          <div className={styles.nameText}>{splitText("Hamza")}</div>
          <div className={styles.nameText}>{splitText("Shaebi")}</div>
        </header>
        
        <Divider />

        <div className={styles.navSection}>
          <nav className={styles.navGrid}>
            <NavLink text="work" />
            <NavLink text="process" />
            <NavLink text="contact" />
          </nav>
        </div>

        <Divider />

        <div className={styles.heroSection}>
          <div className={`${styles.heroBlock} hero-rect`} />
        </div>
      </section>

      <Divider />

      {/* About Section */}
      <section className={`${styles.section} ${styles.aboutSection} about-section snap-section`}>
        <div className={`${styles.aboutCenterBlock} about-rect`} />
        
        <StaggerText 
          text={"anti-\ndisciplinary"} 
          className={`${styles.displayText} ${styles.posAnti}`} 
          charClass="about-text-char" 
        />
        
        <StaggerText 
          text={"& design\nengineer"} 
          className={`${styles.displayText} ${styles.posDesign}`} 
          charClass="about-text-char" 
        />

        <StaggerText 
          text="for" 
          className={`${styles.displayText} ${styles.posFor}`} 
          charClass="about-text-char" 
        />

        <StaggerText 
          text="→ →" 
          className={`${styles.displayText} ${styles.posArrows}`} 
          charClass="about-text-char" 
        />

        <StaggerText 
          text={"cultural\n& creative"} 
          className={`${styles.displayText} ${styles.posCultural}`} 
          charClass="about-text-char" 
        />

        <StaggerText 
          text={"based\npractices"} 
          className={`${styles.displayText} ${styles.posPractices}`} 
          charClass="about-text-char" 
        />
      </section>

      <Divider />

      {/* Location Section */}
      <section className={`${styles.section} ${styles.locationSection} location-section snap-section`}>
        <StaggerText 
          text="located" 
          className={`${styles.displayText} ${styles.posLocated}`} 
          charClass="location-text-char" 
        />
        <StaggerText 
          text="in" 
          className={`${styles.displayText} ${styles.posIn}`} 
          charClass="location-text-char" 
        />
        <StaggerText 
          text="bhx" 
          className={`${styles.displayText} ${styles.posBHX}`} 
          charClass="location-text-char" 
        />
        <StaggerText 
          text="lon" 
          className={`${styles.displayText} ${styles.posLON}`} 
          charClass="location-text-char" 
        />
        
        <div className={`${styles.locationBlock} location-rect`} />

        <StaggerText 
          text="available" 
          className={`${styles.displayText} ${styles.posAvailable}`} 
          charClass="location-text-char" 
        />
        <StaggerText 
          text={"world\nwide"} 
          className={`${styles.displayText} ${styles.posWorld}`} 
          charClass="location-text-char" 
        />
      </section>

      <Divider />

      {/* Work Section */}
      <section className={`${styles.section} ${styles.workSection} work-section snap-section`}>
        <StaggerText 
          text="work" 
          className={`${styles.displayText} ${styles.posWork}`} 
          charClass="work-text-char" 
        />
        <div className={`${styles.displayText} ${styles.posCount} work-count`}>
          [4]
        </div>

        <div className={`${styles.card1} project-card-anim`}>
          <ProjectCard title="project name here" />
        </div>
        <div className={`${styles.card2} project-card-anim`}>
          <ProjectCard title="another project" />
        </div>
        <div className={`${styles.card3} project-card-anim`}>
          <ProjectCard title="creative work" />
        </div>
        <div className={`${styles.card4} project-card-anim`}>
          <ProjectCard title="design engineering" />
        </div>
      </section>

      <Divider />

      {/* Process Section */}
      <section className={`${styles.section} ${styles.processSection} process-section snap-section`}>
        <StaggerText 
          text="process:" 
          className={`${styles.displayText} ${styles.posProcess}`} 
          charClass="process-text-char" 
        />
        <StaggerText 
          text="concept" 
          className={`${styles.displayText} ${styles.posConcept}`} 
          charClass="process-text-char" 
        />

        <div className={styles.processContent}>
          <div className={`${styles.purpleSquare} process-rect`} />
        </div>

        <StaggerText 
          text="build" 
          className={`${styles.displayText} ${styles.posBuild}`} 
          charClass="process-text-char" 
        />
        <StaggerText 
          text="ship" 
          className={`${styles.displayText} ${styles.posShip}`} 
          charClass="process-text-char" 
        />
      </section>

      <Divider />

      {/* Footer CTA */}
      <section className={`${styles.footerSection} footer-section snap-section`}>
        <StaggerText 
          text={"let’s build\nor chat\nabout\nsomething"} 
          className={styles.ctaText} 
          charClass="cta-text-char" 
        />
      </section>
    </main>
  );
}
