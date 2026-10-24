'use client';

import { useEffect, useRef, useState } from 'react';
import posthog from 'posthog-js';
import Divider from '@/components/Divider';
import NavLink from '@/components/NavLink';
import ProjectCard from '@/components/ProjectCard';
import ProjectSheet from '@/components/ProjectSheet';
import { useGSAPAnimations } from '@/hooks/useGSAPAnimations';
import type { SiteSetting } from '@repo/cms/generated/payload-types';
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

export type ProjectItem = {
  id: string | number;
  title: string;
  description: string;
  slug?: string | null;
  projectNumber?: string | null;
  role?: string | null;
  year?: string | null;
  client?: string | null;
  status?: string | null;
  challenge?: string | null;
  heroImage?: number | { url?: string | null; alt?: string | null } | null;
  gallery?: Array<{ id?: string | null; image?: number | { url?: string | null; alt?: string | null } | null; caption?: string | null }> | null;
  order?: number | null;
  published?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
};

export default function HomeClient({ initialProjects, settings }: { initialProjects?: ProjectItem[]; settings?: SiteSetting | null } = {}) {
  const projects: ProjectItem[] = initialProjects && initialProjects.length > 0
    ? initialProjects.map((p) => ({ ...p, id: p.projectNumber || p.id }))
    : MOCK_PROJECTS;

  const introFirst = settings?.intro?.firstName || 'Hamza';
  const introLast = settings?.intro?.lastName || 'Shaebi';
  const aboutCopy = settings?.about;
  const location = settings?.location;
  const socials = settings?.socials;
  const footerCopy = settings?.footer;
  const helloUrl = socials?.sayHello || 'https://hello.byhamza.xyz/';

  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const projectViewStartTimeRef = useRef<number | null>(null);
  const isPostHogConfigured = Boolean(
    process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST,
  );

  const { gotoSection } = useGSAPAnimations(containerRef, isSheetOpen);

  const openProject = (project: ProjectItem) => {
    const cardEl = document.getElementById(`project-card-${project.id}`);
    if (cardEl) {
      setOriginRect(cardEl.getBoundingClientRect());
    } else {
      setOriginRect(null);
    }
    setSelectedProject(project);
    setIsSheetOpen(true);
    // eslint-disable-next-line react-hooks/purity -- event handler, not render phase
    projectViewStartTimeRef.current = Date.now();
    if (isPostHogConfigured) {
      posthog.capture('project_opened', {
        project_id: String(project.id),
        project_title: project.title,
        project_slug: project.slug || getSlug(project.title),
      });
    }
    // Use clean pathnames like /project/project-one
    window.history.pushState(null, '', `/project/${project.slug || getSlug(project.title)}`);
  };

  const closeProject = () => {
    if (isPostHogConfigured && selectedProject) {
      const timeSpentMs = projectViewStartTimeRef.current ? Date.now() - projectViewStartTimeRef.current : 0;
      posthog.capture('project_closed', {
        project_id: String(selectedProject.id),
        project_title: selectedProject.title,
        time_spent_ms: timeSpentMs,
        time_spent_seconds: Math.round(timeSpentMs / 1000),
      });
    }

    projectViewStartTimeRef.current = null;

    if (window.location.pathname.startsWith('/project/')) {
      window.history.back();
    } else {
      setIsSheetOpen(false);
    }
  };

  const handleNextProject = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % projects.length;
    const nextProject = projects[nextIndex];

    // Track time spent on current project before navigating
    if (isPostHogConfigured && projectViewStartTimeRef.current) {
      const timeSpentMs = Date.now() - projectViewStartTimeRef.current;
      posthog.capture('project_viewed', {
        project_id: String(selectedProject.id),
        project_title: selectedProject.title,
        time_spent_ms: timeSpentMs,
        time_spent_seconds: Math.round(timeSpentMs / 1000),
      });
    }

    setSelectedProject(nextProject);
    projectViewStartTimeRef.current = Date.now();
    if (isPostHogConfigured) {
      posthog.capture('project_navigated', {
        direction: 'next',
        project_id: String(nextProject.id),
        project_title: nextProject.title,
      });
    }
    window.history.pushState(null, '', `/project/${nextProject.slug || getSlug(nextProject.title)}`);
  };

  const handlePrevProject = () => {
    if (!selectedProject) return;
    const currentIndex = projects.findIndex(p => p.id === selectedProject.id);
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    const prevProject = projects[prevIndex];

    // Track time spent on current project before navigating
    if (isPostHogConfigured && projectViewStartTimeRef.current) {
      const timeSpentMs = Date.now() - projectViewStartTimeRef.current;
      posthog.capture('project_viewed', {
        project_id: String(selectedProject.id),
        project_title: selectedProject.title,
        time_spent_ms: timeSpentMs,
        time_spent_seconds: Math.round(timeSpentMs / 1000),
      });
    }

    setSelectedProject(prevProject);
    projectViewStartTimeRef.current = Date.now();
    if (isPostHogConfigured) {
      posthog.capture('project_navigated', {
        direction: 'previous',
        project_id: String(prevProject.id),
        project_title: prevProject.title,
      });
    }
    window.history.pushState(null, '', `/project/${prevProject.slug || getSlug(prevProject.title)}`);
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith('/project/')) {
        const slug = pathname.replace('/project/', '');
        const project = projects.find((p) => (p.slug === slug || getSlug(p.title) === slug));
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
  }, [projects]);

  // Track visitor arrival
  useEffect(() => {
    if (isPostHogConfigured) {
      posthog.capture('visitor_arrived', {
        referrer: document.referrer,
        projects_count: projects.length,
      });
    }
  }, [isPostHogConfigured, projects.length]);

  return (
    <>
      <main 
        className={styles.main} 
        ref={containerRef}
      >
        {/* Intro Section */}
        <section className={`${styles.introSection} snap-section`}>
          <header className={styles.header}>
            <div className={`${styles.nameText} intro-name`}>{splitText(introFirst)}</div>
            <div className={`${styles.nameText} intro-name`}>{splitText(introLast)}</div>
          </header>
          
          <Divider hidden={isSheetOpen} />

          <div className={styles.navSection}>
            <nav className={`${styles.navGrid} intro-nav`}>
              <NavLink 
                text="work" 
                variant="fill" 
                href="#work" 
                onClick={(e) => {
                  e.preventDefault();
                  gotoSection(3);
                }}
              />
              <NavLink 
                text="process" 
                href="#process" 
                onClick={(e) => {
                  e.preventDefault();
                  gotoSection(4);
                }}
              />
              <NavLink text="writing" href="/blog" />
              <NavLink
                text="socials"
                href="#footer"
                onClick={(e) => {
                  e.preventDefault();
                  gotoSection(5);
                }}
              />
              <NavLink
                text="say   hello"
                href={helloUrl}
                onClick={() => {
                  if (isPostHogConfigured) {
                    posthog.capture('contact_link_clicked', {
                      source: 'nav',
                      location: 'intro',
                    });
                  }
                }}
              />
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
            text={aboutCopy?.anti || "anti-\ndisciplinary"}
            className={`${styles.displayText} ${styles.posAnti} about-anti`}
          />

          <StaggerText
            text={aboutCopy?.design || "& design\nengineer"}
            className={`${styles.displayText} ${styles.posDesign} about-design`}
          />

          <StaggerText
            text={aboutCopy?.forWord || "for"}
            className={`${styles.displayText} ${styles.posFor} about-for`}
          />

          <StaggerText
            text={aboutCopy?.arrows || "→ →"}
            className={`${styles.displayText} ${styles.posArrows} about-arrows`}
          />

          <StaggerText
            text={aboutCopy?.cultural || "cultural\n& creative"}
            className={`${styles.displayText} ${styles.posCultural} about-cultural`}
          />

          <StaggerText
            text={aboutCopy?.practices || "based\npractices"}
            className={`${styles.displayText} ${styles.posPractices} about-practices`}
          />
        </section>

        {/* Location Section */}
        <section className={`${styles.section} ${styles.locationSection} snap-section section-location`}>
          <div className={styles.locationTopWrapper}>
            <StaggerText 
              text="located" 
              className={`${styles.displayText} ${styles.posLocated} location-located`} 
            />
            <StaggerText 
              text="in" 
              className={`${styles.displayText} ${styles.posIn} location-in`} 
            />
            <StaggerText
              text={location?.cityPrimary || "bhx"}
              className={`${styles.displayText} ${styles.posBHX} location-bhx`}
            />
            <StaggerText
              text={location?.citySecondary || "lon"}
              className={`${styles.displayText} ${styles.posLON} location-lon`}
            />
          </div>
          
          <div className={`${styles.locationBlock} location-block`} />

          <div className={styles.locationBottomWrapper}>
            <div className={`${styles.posAvailable} location-available`}>
              <StaggerText text="avail" className={styles.displayText} />
              <StaggerText text="able" className={styles.displayText} />
            </div>
            <div className={`${styles.posWorld} location-world`}>
              <StaggerText text="world" className={styles.displayText} />
              <StaggerText text="wide" className={styles.displayText} />
            </div>
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
              data-count={projects.length}
            >
              [{projects.length}]
            </div>
          </div>

          {projects.map((project) => (
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
            <a
              href={helloUrl}
              className={styles.ctaLink}
              onClick={() => {
                if (isPostHogConfigured) {
                  posthog.capture('contact_link_clicked', {
                    source: 'footer',
                    location: 'cta',
                    total_projects_viewed: selectedProject ? 1 : 0,
                  });
                }
              }}
            >
              <StaggerText
                text={footerCopy?.ctaText || "let's build\nor chat\nabout\nsomething"}
                className={`${styles.ctaText} cta-text`}
                highlightWord={footerCopy?.ctaHighlightWord || "chat"}
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
