'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Divider from '@/components/Divider';
import NavLink from '@/components/NavLink';
import ProjectCard from '@/components/ProjectCard';
import ProjectSheet from '@/components/ProjectSheet';
import styles from '../app/page.module.css';

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

// Safari/Mobile Optimizations
if (typeof window !== "undefined") {
  ScrollTrigger.config({ ignoreMobileResize: true });
}

const MOCK_PROJECTS = [
  { id: '01', title: 'Project One', description: 'A creative exploration of interactive design systems.' },
  { id: '02', title: 'Dynamic Interface', description: 'Building fluid components for modern web applications.' },
  { id: '03', title: 'Visual Identity', description: 'Defining brand language through minimal aesthetic.' },
  { id: '04', title: 'Design Engineering', description: 'Bridging the gap between design and technical implementation.' }
];

const splitText = (text: string, charClass: string = "name-char") => {
  return text.split('').map((char, i) => (
    <span key={i} className={charClass} style={{ display: 'inline-block' }}>
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));
};

const StaggerText = ({ text, className, charClass, highlightWord, highlightClass }: { text: string, className?: string, charClass: string, highlightWord?: string, highlightClass?: string }) => {
  const lines = text.split('\n');
  return (
    <div className={className}>
      {lines.map((line, lineIndex) => {
        const words = line.split(' ');
        return (
          <span key={lineIndex} style={{ display: 'block', textAlign: 'inherit' }}>
            {words.map((word, wordIndex) => {
              const isHighlight = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());
              const chars = word.split('');
              return (
                <span 
                  key={wordIndex} 
                  style={{ 
                    display: 'inline-block', 
                    whiteSpace: 'nowrap',
                    position: 'relative'
                  }}
                >
                  {isHighlight && (
                    <span 
                      className={`${highlightClass} highlight-bg`} 
                      style={{ 
                        position: 'absolute', 
                        top: '5%', 
                        left: '-4px', 
                        right: '-4px', 
                        bottom: '5%', 
                        zIndex: 0,
                        transformOrigin: 'left'
                      }} 
                    />
                  )}
                  {chars.map((char, charIndex) => (
                    <span 
                      key={charIndex} 
                      className={charClass} 
                      style={{ 
                        display: 'inline-block',
                        position: 'relative',
                        zIndex: 1,
                        color: isHighlight ? '#000000' : 'inherit'
                      }}
                    >
                      {char}
                    </span>
                  ))}
                  {wordIndex < words.length - 1 && (
                    <span className={charClass} style={{ display: 'inline-block' }}>
                      {'\u00A0'}
                    </span>
                  )}
                </span>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};

export default function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openProject = (project: any) => {
    console.log('Opening project:', project.title);
    setSelectedProject(project);
    setIsSheetOpen(true);
  };

  const closeProject = () => {
    setIsSheetOpen(false);
  };

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
          start: "top 85%",
          toggleActions: "play none none none",
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
          start: "top 85%",
          toggleActions: "play none none none",
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
          start: "top 85%",
          toggleActions: "play none none none",
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
          val: MOCK_PROJECTS.length,
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
          start: "top 85%",
          toggleActions: "play none none none",
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
      const footerTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".footer-section",
          start: "top 85%",
          toggleActions: "play none none none",
        }
      });

      footerTl
        .from(".cta-text-char", {
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.8,
          ease: "power3.out",
        })
        .from(".highlight-bg", {
          scaleX: 0,
          duration: 0.6,
          ease: "power3.inOut"
        }, "-=0.2");

      // Force a refresh after a small delay to ensure calculations are correct 
      // after fonts load and initial layout is complete, especially on mobile.
      const timeoutId = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      return () => {
        clearTimeout(timeoutId);
      };

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
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
              <NavLink text="say   hello" href="https://hello.byhamza.xyz/" />
            </nav>
          </div>

          <Divider />

          <div className={styles.heroSection}>
            <div className={`${styles.heroBlock} hero-rect`} />
          </div>
        </section>

        {/* About Section */}
        <section className={`${styles.section} ${styles.aboutSection} about-section snap-section`}>
          <div className={`${styles.aboutCenterBlock} about-rect`} />
          
          <StaggerText 
            text={"anti-\ndisciplinary"} 
            className={`${styles.displayText} ${styles.posAnti} posAnti`} 
            charClass="about-text-char" 
          />
          
          <StaggerText 
            text={"& design\nengineer"} 
            className={`${styles.displayText} ${styles.posDesign} posDesign`} 
            charClass="about-text-char" 
          />

          <StaggerText 
            text="for" 
            className={`${styles.displayText} ${styles.posFor} posFor`} 
            charClass="about-text-char" 
          />

          <StaggerText 
            text="→ →" 
            className={`${styles.displayText} ${styles.posArrows} posArrows`} 
            charClass="about-text-char" 
          />

          <StaggerText 
            text={"cultural\n& creative"} 
            className={`${styles.displayText} ${styles.posCultural} posCultural`} 
            charClass="about-text-char" 
          />

          <StaggerText 
            text={"based\npractices"} 
            className={`${styles.displayText} ${styles.posPractices} posPractices`} 
            charClass="about-text-char" 
          />
        </section>

        {/* Location Section */}
        <section className={`${styles.section} ${styles.locationSection} location-section snap-section`}>
          <StaggerText 
            text="located" 
            className={`${styles.displayText} ${styles.posLocated} posLocated`} 
            charClass="location-text-char" 
          />
          <StaggerText 
            text="in" 
            className={`${styles.displayText} ${styles.posIn} posIn`} 
            charClass="location-text-char" 
          />
          <StaggerText 
            text="bhx" 
            className={`${styles.displayText} ${styles.posBHX} posBHX`} 
            charClass="location-text-char" 
          />
          <StaggerText 
            text="lon" 
            className={`${styles.displayText} ${styles.posLON} posLON`} 
            charClass="location-text-char" 
          />
          
          <div className={`${styles.locationBlock} location-rect`} />

          <StaggerText 
            text="available" 
            className={`${styles.displayText} ${styles.posAvailable} posAvailable`} 
            charClass="location-text-char" 
          />
          <StaggerText 
            text={"world\nwide"} 
            className={`${styles.displayText} ${styles.posWorld} posWorld`} 
            charClass="location-text-char" 
          />
        </section>

        {/* Work Section */}
        <section className={`${styles.section} ${styles.workSection} work-section snap-section`}>
          <StaggerText 
            text="work" 
            className={`${styles.displayText} ${styles.posWork} posWork`} 
            charClass="work-text-char" 
          />
          <div className={`${styles.displayText} ${styles.posCount} work-count`}>
            [{MOCK_PROJECTS.length}]
          </div>

          {MOCK_PROJECTS.map((project, index) => (
            <div 
              key={project.id} 
              className={`${styles[`card${index + 1}`] || styles.card1} project-card-anim`}
              onClick={() => openProject(project)}
              style={{ cursor: 'pointer' }}
            >
              <ProjectCard 
                title={project.title} 
              />
            </div>
          ))}
        </section>

        {/* Process Section */}
        <section className={`${styles.section} ${styles.processSection} process-section snap-section`}>
          <StaggerText 
            text="process:" 
            className={`${styles.displayText} ${styles.posProcess} posProcess`} 
            charClass="process-text-char" 
          />
          <StaggerText 
            text="concept" 
            className={`${styles.displayText} ${styles.posConcept} posConcept`} 
            charClass="process-text-char" 
          />

          <div className={styles.processContent}>
            <div className={`${styles.purpleSquare} process-rect`} />
          </div>

          <StaggerText 
            text="build" 
            className={`${styles.displayText} ${styles.posBuild} posBuild`} 
            charClass="process-text-char" 
          />
          <StaggerText 
            text="ship" 
            className={`${styles.displayText} ${styles.posShip} posShip`} 
            charClass="process-text-char" 
          />
        </section>

        {/* Footer CTA */}
        <section className={`${styles.footerSection} footer-section snap-section`}>
          <div className={styles.footerContent}>
            <a href="https://hello.byhamza.xyz/" className={styles.ctaLink}>
              <StaggerText 
                text={"let’s build\nor chat\nabout\nsomething"} 
                className={styles.ctaText} 
                charClass="cta-text-char" 
                highlightWord="chat"
                highlightClass={styles.orangeHighlight}
              />
            </a>
          </div>
        </section>
      </main>

      <ProjectSheet 
        isOpen={isSheetOpen} 
        onClose={closeProject} 
        project={selectedProject} 
      />
    </>
  );
}
