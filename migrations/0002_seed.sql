-- Seed initial projects into Cloudflare D1

INSERT OR IGNORE INTO `projects` (
  `id`, `project_number`, `title`, `slug`, `description`, `role`, `year`, `client`, `status`, `challenge`, `order`, `published`
) VALUES
(
  1,
  '01',
  'Project One',
  'project-one',
  'A creative exploration of interactive design systems.',
  'Design Engineer',
  '2024',
  'Internal Exploration',
  'Live',
  'Crafting a seamless experience that bridges the gap between complex functionality and minimalistic design. The goal was to create an interface that feels invisible, allowing the content to take center stage while maintaining a strong, distinct brand identity.\n\nThrough meticulous attention to typography, spacing, and micro-interactions, we developed a system that scales elegantly across devices.',
  1,
  1
),
(
  2,
  '02',
  'Dynamic Interface',
  'dynamic-interface',
  'Building fluid components for modern web applications.',
  'Design Engineer',
  '2024',
  'Internal Exploration',
  'Live',
  'Creating responsive, physics-based interactions that feel organic and performant across devices of all form factors.',
  2,
  1
),
(
  3,
  '03',
  'Visual Identity',
  'visual-identity',
  'Defining brand language through minimal aesthetic.',
  'Design Engineer',
  '2024',
  'Internal Exploration',
  'Live',
  'Establishing a typography-led visual identity that communicates precision and creative craft without visual noise.',
  3,
  1
),
(
  4,
  '04',
  'Design Engineering',
  'design-engineering',
  'Bridging the gap between design and technical implementation.',
  'Design Engineer',
  '2024',
  'Internal Exploration',
  'Live',
  'Transforming high-fidelity concepts and animations into production-ready web software with GSAP and modern component systems.',
  4,
  1
);
