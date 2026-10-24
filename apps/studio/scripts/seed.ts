import { loadEnv } from 'payload/node'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import type { Service, Tool } from '@repo/cms/generated/payload-types'

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
      intro: {
        firstName: 'Hamza',
        lastName: 'Shaebi',
      },
      about: {
        anti: 'anti-\ndisciplinary',
        design: '& design\nengineer',
        forWord: 'for',
        arrows: '→ →',
        cultural: 'cultural\n& creative',
        practices: 'based\npractices',
      },
      location: {
        cityPrimary: 'bhx',
        citySecondary: 'lon',
        status: 'available worldwide',
      },
      footer: {
        ctaText: "let's build\nor chat\nabout\nsomething",
        ctaHighlightWord: 'chat',
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

  const existingPosts = await payload.find({ collection: 'posts', limit: 1 })
  if (existingPosts.totalDocs === 0) {
    console.log('Seeding initial post...')
    await payload.create({
      collection: 'posts',
      data: {
        title: 'Hello World',
        slug: 'hello-world',
        excerpt: 'First entry — what this site is and what I plan to write about.',
        content: {
          root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: [
                  {
                    type: 'text',
                    text: 'This is the first post on the site. Writing about design engineering, creative tech, and the process of building things lives here.',
                    version: 1,
                    detail: 0,
                    format: 0,
                    mode: 'normal',
                    style: '',
                  },
                ],
              },
            ],
          },
        },
        publishedDate: new Date().toISOString(),
        published: true,
      },
    })
    console.log('Created post: Hello World')
  } else {
    console.log(`Posts already exist (${existingPosts.totalDocs} found). Skipping.`)
  }

  const existingTools = await payload.find({ collection: 'tools', limit: 1 })
  if (existingTools.totalDocs === 0) {
    console.log('Seeding initial tools...')
    const tools: Partial<Tool>[] = [
      { name: 'Figma', category: 'design', description: 'Interface design and prototyping.', url: 'https://figma.com', order: 1 },
      { name: 'VS Code', category: 'development', description: 'Primary editor.', url: 'https://code.visualstudio.com', order: 2 },
      { name: 'Linear', category: 'software', description: 'Issue tracking and project planning.', url: 'https://linear.app', order: 3 },
      { name: 'Cloudflare Workers', category: 'development', description: 'Edge compute — hosts this site.', url: 'https://workers.cloudflare.com', order: 4 },
    ]
    for (const tool of tools) {
      await payload.create({ collection: 'tools', data: { ...tool, name: tool.name!, published: true } })
    }
    console.log(`Created ${tools.length} tools`)
  } else {
    console.log(`Tools already exist (${existingTools.totalDocs} found). Skipping.`)
  }

  const existingServices = await payload.find({ collection: 'services', limit: 1 })
  if (existingServices.totalDocs === 0) {
    console.log('Seeding initial services...')
    const services: Partial<Service>[] = [
      {
        title: 'Design Engineering Sprint',
        slug: 'design-engineering-sprint',
        key: 'design_engineering',
        summary: 'A focused sprint to design and build a key flow, feature, or surface.',
        priceLabel: 'from £5k',
        deliverables: [
          { item: 'Scoped sprint plan and milestones' },
          { item: 'Production-ready front-end implementation' },
          { item: 'Handoff docs and Loom walkthrough' },
        ],
        order: 1,
      },
      {
        title: 'Consultancy & Advisory',
        slug: 'consultancy-advisory',
        key: 'consultancy',
        summary: 'Embedded design-engineering advisory for product and brand teams.',
        priceLabel: 'POA',
        deliverables: [
          { item: 'Weekly advisory sessions' },
          { item: 'Architecture and design-system reviews' },
          { item: 'Async support between sessions' },
        ],
        order: 2,
      },
      {
        title: 'Full Production Build',
        slug: 'full-production-build',
        key: 'full_production',
        summary: 'End-to-end design and engineering of a site or product surface.',
        priceLabel: 'from £25k',
        deliverables: [
          { item: 'Discovery and creative direction' },
          { item: 'Design system and component library' },
          { item: 'Production build, deployment, and launch' },
        ],
        order: 3,
      },
    ]
    for (const service of services) {
      await payload.create({ collection: 'services', data: { ...service, title: service.title!, summary: service.summary!, published: true } })
    }
    console.log(`Created ${services.length} services`)
  } else {
    console.log(`Services already exist (${existingServices.totalDocs} found). Skipping.`)
  }

  console.log('Seed completed successfully!')
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
