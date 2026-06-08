'use client';

import { useEffect, useRef, useState } from 'react';
import Divider from '@/components/Divider';
import NavLink from '@/components/NavLink';
import ProjectCard from '@/components/ProjectCard';
import ProjectSheet from '@/components/ProjectSheet';
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
                      className={`${highlightClass} highlight-bg`} 
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

  const openProject = (project: any) => {
    setSelectedProject(project);
    setIsSheetOpen(true);
  };

  const closeProject = () => {
    setIsSheetOpen(false);
  };

  return (
    <>
      <main 
        className={styles.main} 
        ref={containerRef}
        style={{ overflowY: isSheetOpen ? 'hidden' : 'auto' }}
      >
        {/* Intro Section */}
        <section className={`${styles.introSection} snap-section`}>
          <header className={styles.header}>
            <div className={styles.nameText}>{splitText("Hamza")}</div>
            <div className={styles.nameText}>{splitText("Shaebi")}</div>
          </header>
          
          <Divider hidden={isSheetOpen} />

          <div className={styles.navSection}>
            <nav className={styles.navGrid}>
              <NavLink text="work" variant="fill" href="#work" />
              <NavLink text="process" href="#process" />
              <NavLink text="say   hello" href="https://hello.byhamza.xyz/" />
            </nav>
          </div>

          <Divider hidden={isSheetOpen} />

          <div className={styles.heroSection}>
            <div className={styles.heroBlock} />
          </div>
        </section>

        {/* About Section */}
        <section className={`${styles.section} ${styles.aboutSection} snap-section`}>
          <div className={styles.aboutCenterBlock} />
          
          <StaggerText 
            text={"anti-\ndisciplinary"} 
            className={`${styles.displayText} ${styles.posAnti}`} 
          />
          
          <StaggerText 
            text={"& design\nengineer"} 
            className={`${styles.displayText} ${styles.posDesign}`} 
          />

          <StaggerText 
            text="for" 
            className={`${styles.displayText} ${styles.posFor}`} 
          />

          <StaggerText 
            text="→ →" 
            className={`${styles.displayText} ${styles.posArrows}`} 
          />

          <StaggerText 
            text={"cultural\n& creative"} 
            className={`${styles.displayText} ${styles.posCultural}`} 
          />

          <StaggerText 
            text={"based\npractices"} 
            className={`${styles.displayText} ${styles.posPractices}`} 
          />
        </section>

        {/* Location Section */}
        <section className={`${styles.section} ${styles.locationSection} snap-section`}>
          <StaggerText 
            text="located" 
            className={`${styles.displayText} ${styles.posLocated}`} 
          />
          <StaggerText 
            text="in" 
            className={`${styles.displayText} ${styles.posIn}`} 
          />
          <StaggerText 
            text="bhx" 
            className={`${styles.displayText} ${styles.posBHX}`} 
          />
          <StaggerText 
            text="lon" 
            className={`${styles.displayText} ${styles.posLON}`} 
          />
          
          <div className={styles.locationBlock} />

          <div className={styles.posAvailable}>
            <StaggerText text="avail" className={styles.displayText} />
            <StaggerText text="able" className={styles.displayText} />
          </div>
          <div className={styles.posWorld}>
            <StaggerText text="world" className={styles.displayText} />
            <StaggerText text="wide" className={styles.displayText} />
          </div>
        </section>

        {/* Work Section */}
        <section id="work" className={`${styles.section} ${styles.workSection} snap-section`}>
          <div className={styles.workHeader}>
            <StaggerText 
              text="work" 
              className={styles.displayText} 
            />
            <div className={styles.workCount}>
              [{MOCK_PROJECTS.length}]
            </div>
          </div>

          {MOCK_PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              className={styles.projectCardWrap}
              title={project.title}
              onClick={() => openProject(project)}
            />
          ))}
        </section>

        {/* Process Section */}
        <section id="process" className={`${styles.section} ${styles.processSection} snap-section`}>
          <StaggerText 
            text="process:" 
            className={`${styles.displayText} ${styles.posProcess}`} 
          />
          <StaggerText 
            text="concept" 
            className={`${styles.displayText} ${styles.posConcept}`} 
          />

          <div className={styles.processContent}>
            <div className={styles.purpleSquare} />
          </div>

          <StaggerText 
            text="build" 
            className={`${styles.displayText} ${styles.posBuild}`} 
          />
          <StaggerText 
            text="ship" 
            className={`${styles.displayText} ${styles.posShip}`} 
          />
        </section>

        {/* Footer CTA */}
        <section className={`${styles.footerSection} snap-section`}>
          <div className={styles.footerContent}>
            <a href="https://hello.byhamza.xyz/" className={styles.ctaLink}>
              <StaggerText 
                text={"let’s build\nor chat\nabout\nsomething"} 
                className={styles.ctaText} 
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
