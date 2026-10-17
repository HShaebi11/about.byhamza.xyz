import { loadEnv } from 'payload/node'
import { getPayload } from 'payload'
import configPromise from '../payload.config'

export async function seed() {
  loadEnv()
  const payload = await getPayload({ config: configPromise })

  console.log('Checking existing projects...')
  const existingProjects = await payload.find({
    collection: 'projects',
    limit: 1,
  })

  if (existingProjects.totalDocs === 0) {
    console.log('Seeding initial projects...')
    const initialProjects = [
      {
        projectNumber: '01',
        title: 'Project One',
        slug: 'project-one',
        description: 'A creative exploration of interactive design systems.',
        role: 'Design Engineer',
        year: '2024',
        client: 'Internal Exploration',
        status: 'Live' as const,
        challenge:
          'Crafting a seamless experience that bridges the gap between complex functionality and minimalistic design. The goal was to create an interface that feels invisible, allowing the content to take center stage while maintaining a strong, distinct brand identity.\n\nThrough meticulous attention to typography, spacing, and micro-interactions, we developed a system that scales elegantly across devices.',
        order: 1,
        published: true,
      },
      {
        projectNumber: '02',
        title: 'Dynamic Interface',
        slug: 'dynamic-interface',
        description: 'Building fluid components for modern web applications.',
        role: 'Design Engineer',
        year: '2024',
        client: 'Internal Exploration',
        status: 'Live' as const,
        challenge:
          'Creating responsive, physics-based interactions that feel organic and performant across devices of all form factors.',
        order: 2,
        published: true,
      },
      {
        projectNumber: '03',
        title: 'Visual Identity',
        slug: 'visual-identity',
        description: 'Defining brand language through minimal aesthetic.',
        role: 'Design Engineer',
        year: '2024',
        client: 'Internal Exploration',
        status: 'Live' as const,
        challenge:
          'Establishing a typography-led visual identity that communicates precision and creative craft without visual noise.',
        order: 3,
        published: true,
      },
      {
        projectNumber: '04',
        title: 'Design Engineering',
        slug: 'design-engineering',
        description: 'Bridging the gap between design and technical implementation.',
        role: 'Design Engineer',
        year: '2024',
        client: 'Internal Exploration',
        status: 'Live' as const,
        challenge:
          'Transforming high-fidelity concepts and animations into production-ready web software with GSAP and modern component systems.',
        order: 4,
        published: true,
      },
    ]

    for (const project of initialProjects) {
      await payload.create({
        collection: 'projects',
        data: project,
      })
      console.log(`Created project: ${project.title}`)
    }
  } else {
    console.log(`Projects already exist (${existingProjects.totalDocs} found). Skipping seed.`)
  }

  console.log('Seeding SiteSettings...')
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      name: 'Hamza Shaebi | Portfolio',
      description: 'Anti-disciplinarity & Design Engineer',
      location: {
        cityPrimary: 'bhx',
        citySecondary: 'lon',
        status: 'available worldwide',
      },
      socials: {
        twitter: 'https://twitter.com/hamzashaebi',
        github: 'https://github.com/hamzashaebi',
        linkedin: 'https://linkedin.com/in/hamzashaebi',
        sayHello: 'https://hello.byhamza.xyz/',
      },
    },
  })
  console.log('SiteSettings initialized.')

  console.log('Seed completed successfully!')
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
