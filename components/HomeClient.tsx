'use client';

import { useEffect, useRef, useState } from 'react';
import Divider from '@/components/Divider';
import NavLink from '@/components/NavLink';
import ProjectCard from '@/components/ProjectCard';
import ProjectSheet from '@/components/ProjectSheet';
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations';
import styles from '../app/page.module.css';

const MOCK_PROJECTS = [
  { id: '01', title: 'Project One', description: 'A creative exploration of interactive design systems.' },
  { id: '02', title: 'Dynamic Interface', description: 'Building fluid components for modern web applications.' },
  { id: '03', title: 'Visual Identity', description: 'Defining brand language through minimal aesthetic.' },
  { id: '04', title: 'Design Engineering', description: 'Bridging the gap between design and technical implementation.' }
];

const splitText = (text: string) => {
  return text;
};

const getSlug = (title: string) => {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const StaggerText = ({ text, className, highlightWord, highlightClass }: { text: string, className?: string, charClass?: string, highlightWord?: string, highlightClass?: string }) => {
  const lines = text.split('\n');
  return (
    <div className={className}>
      {lines.map((line, lineIndex) => {
        const words = line.split(' ');
        return (
          <span key={lineIndex} style={{ display: 'block', textAlign: 'inherit' }}>
            {words.map((word, wordIndex) => {
              const isHighlight = highlightWord && word.toLowerCase().includes(highlightWord.toLowerCase());
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
                      className={`${highlightClass} highlight-bg orange-highlight`} 
                      style={{ 
                        position: 'absolute', 
                        top: '5%', 
                        left: '-4px', 
                        right: '-4px', 
                        bottom: '5%', 
                        zIndex: 0,
                      }} 
                    />
                  )}
                  <span 
                    style={{ 
                      display: 'inline-block',
                      position: 'relative',
                      zIndex: 1,
                      color: isHighlight ? '#000000' : 'inherit'
                    }}
                  >
                    {word}
                  </span>
                  {wordIndex < words.length - 1 && (
                    <span style={{ display: 'inline-block' }}>
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
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  useGSAPAnimations(containerRef);

  const openProject = (project: any) => {
    const cardEl = document.getElementById(`project-card-${project.id}`);
    if (cardEl) {
      setOriginRect(cardEl.getBoundingClientRect());
    } else {
      setOriginRect(null);
    }
    setSelectedProject(project);
    setIsSheetOpen(true);
    // Use clean pathnames like /project/project-one
    window.history.pushState(null, '', `/project/${getSlug(project.title)}`);
  };

  const closeProject = () => {
    if (window.location.pathname.startsWith('/project/')) {
      window.history.back();
    } else {
      setIsSheetOpen(false);
    }
  };

  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = MOCK_PROJECTS.findIndex(p => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % MOCK_PROJECTS.length;
    const nextProject = MOCK_PROJECTS[nextIndex];
    setSelectedProject(nextProject);
    window.history.pushState(null, '', `/project/${getSlug(nextProject.title)}`);
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = MOCK_PROJECTS.findIndex(p => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + MOCK_PROJECTS.length) % MOCK_PROJECTS.length;
    const prevProject = MOCK_PROJECTS[prevIndex];
    setSelectedProject(prevProject);
    window.history.pushState(null, '', `/project/${getSlug(prevProject.title)}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/project/')) {
        const slug = pathname.replace('/project/', '');
        const project = MOCK_PROJECTS.find((p) => getSlug(p.title) === slug);
        if (project) {
          setSelectedProject(project);
          setIsSheetOpen(true);
          return;
        }
      }
      setIsSheetOpen(false);
    };

    // Run once on load so shared URLs automatically open the project
    handlePopState();
    
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <>
      <main 
        className={styles.main} 
        ref={containerRef}
      >
        {/* Intro Section */}
        <section className={`${styles.introSection} snap-section`}>
          <header className={styles.header}>
            <div className={`${styles.nameText} intro-name`}>{splitText("Hamza")}</div>
            <div className={`${styles.nameText} intro-name`}>{splitText("Shaebi")}</div>
          </header>
          
          <Divider hidden={isSheetOpen} />

          <div className={styles.navSection}>
            <nav className={`${styles.navGrid} intro-nav`}>
              <NavLink text="work" variant="fill" href="#work" />
              <NavLink text="process" href="#process" />
              <NavLink text="socials" href="#" />
              <NavLink text="say   hello" href="https://hello.byhamza.xyz/" />
            </nav>
          </div>

          <Divider hidden={isSheetOpen} />

          <div className={styles.heroSection}>
            <div className={`${styles.heroBlock} intro-hero-block`} />
          </div>
        </section>

        {/* About Section */}
        <section className={`${styles.section} ${styles.aboutSection} snap-section section-about`}>
          <div className={`${styles.aboutCenterBlock} about-bg-block`} />
          
          <StaggerText 
            text={"anti-\ndisciplinary"} 
            className={`${styles.displayText} ${styles.posAnti} about-anti`} 
          />
          
          <StaggerText 
            text={"& design\nengineer"} 
            className={`${styles.displayText} ${styles.posDesign} about-design`} 
          />

          <StaggerText 
            text="for" 
            className={`${styles.displayText} ${styles.posFor} about-for`} 
          />

          <StaggerText 
            text="→ →" 
            className={`${styles.displayText} ${styles.posArrows} about-arrows`} 
          />

          <StaggerText 
            text={"cultural\n& creative"} 
            className={`${styles.displayText} ${styles.posCultural} about-cultural`} 
          />

          <StaggerText 
            text={"based\npractices"} 
            className={`${styles.displayText} ${styles.posPractices} about-practices`} 
          />
        </section>

        {/* Location Section */}
        <section className={`${styles.section} ${styles.locationSection} snap-section section-location`}>
          <StaggerText 
            text="located" 
            className={`${styles.displayText} ${styles.posLocated} location-located`} 
          />
          <StaggerText 
            text="in" 
            className={`${styles.displayText} ${styles.posIn} location-in`} 
          />
          <StaggerText 
            text="bhx" 
            className={`${styles.displayText} ${styles.posBHX} location-bhx`} 
          />
          <StaggerText 
            text="lon" 
            className={`${styles.displayText} ${styles.posLON} location-lon`} 
          />
          
          <div className={`${styles.locationBlock} location-block`} />

          <div className={`${styles.posAvailable} location-available`}>
            <StaggerText text="avail" className={styles.displayText} />
            <StaggerText text="able" className={styles.displayText} />
          </div>
          <div className={`${styles.posWorld} location-world`}>
            <StaggerText text="world" className={styles.displayText} />
            <StaggerText text="wide" className={styles.displayText} />
          </div>
        </section>

        {/* Work Section */}
        <section id="work" className={`${styles.section} ${styles.workSection} snap-section section-work`}>
          <div className={styles.workHeader}>
            <StaggerText 
              text="work" 
              className={`${styles.displayText} work-title`} 
            />
            <div
              className={`${styles.workCount} work-count`}
              data-count={MOCK_PROJECTS.length}
            >
              [{MOCK_PROJECTS.length}]
            </div>
          </div>

          {MOCK_PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              id={`project-card-${project.id}`}
              className={`${styles.projectCardWrap} work-card`}
              title={project.title}
              onClick={() => openProject(project)}
            />
          ))}
        </section>

        {/* Process Section */}
        <section id="process" className={`${styles.section} ${styles.processSection} snap-section section-process`}>
          <StaggerText 
            text="process:" 
            className={`${styles.displayText} ${styles.posProcess} process-label`} 
          />
          <StaggerText 
            text="concept" 
            className={`${styles.displayText} ${styles.posConcept} process-concept`} 
          />

          <div className={styles.processContent}>
            <div className={`${styles.purpleSquare} process-square`} />
          </div>

          <StaggerText 
            text="build" 
            className={`${styles.displayText} ${styles.posBuild} process-build`} 
          />
          <StaggerText 
            text="ship" 
            className={`${styles.displayText} ${styles.posShip} process-ship`} 
          />
        </section>

        {/* Footer CTA */}
        <section className={`${styles.footerSection} snap-section section-footer`}>
          <div className={styles.footerContent}>
            <a href="https://hello.byhamza.xyz/" className={styles.ctaLink}>
              <StaggerText 
                text={"let's build\nor chat\nabout\nsomething"} 
                className={`${styles.ctaText} cta-text`} 
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
        onNext={handleNextProject}
        onPrev={handlePrevProject}
        originRect={originRect}
      />
    </>
  );
}
