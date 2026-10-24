import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Site',
    description: 'Name, location, and links shown on the live site.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      defaultValue: 'Hamza Shaebi | Portfolio',
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue: 'Anti-disciplinarity & Design Engineer',
    },
    {
      name: 'intro',
      type: 'group',
      admin: {
        description: 'Large intro name rendered as two lines',
      },
      fields: [
        {
          name: 'firstName',
          type: 'text',
          defaultValue: 'Hamza',
        },
        {
          name: 'lastName',
          type: 'text',
          defaultValue: 'Shaebi',
        },
      ],
    },
    {
      name: 'about',
      type: 'group',
      admin: {
        description: 'Word collage text in the about section — one field per positioned block',
      },
      fields: [
        {
          name: 'anti',
          type: 'textarea',
          defaultValue: 'anti-\ndisciplinary',
        },
        {
          name: 'design',
          type: 'textarea',
          defaultValue: '& design\nengineer',
        },
        {
          name: 'forWord',
          type: 'text',
          defaultValue: 'for',
        },
        {
          name: 'arrows',
          type: 'text',
          defaultValue: '→ →',
        },
        {
          name: 'cultural',
          type: 'textarea',
          defaultValue: 'cultural\n& creative',
        },
        {
          name: 'practices',
          type: 'textarea',
          defaultValue: 'based\npractices',
        },
      ],
    },
    {
      name: 'location',
      type: 'group',
      fields: [
        {
          name: 'cityPrimary',
          type: 'text',
          defaultValue: 'bhx',
        },
        {
          name: 'citySecondary',
          type: 'text',
          defaultValue: 'lon',
        },
        {
          name: 'status',
          type: 'text',
          defaultValue: 'available worldwide',
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        {
          name: 'ctaText',
          type: 'textarea',
          defaultValue: "let's build\nor chat\nabout\nsomething",
        },
        {
          name: 'ctaHighlightWord',
          type: 'text',
          defaultValue: 'chat',
          admin: {
            description: 'Word inside the CTA text that gets the highlight treatment',
          },
        },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      fields: [
        {
          name: 'twitter',
          type: 'text',
          defaultValue: 'https://twitter.com/hamzashaebi',
        },
        {
          name: 'github',
          type: 'text',
          defaultValue: 'https://github.com/hamzashaebi',
        },
        {
          name: 'linkedin',
          type: 'text',
          defaultValue: 'https://linkedin.com/in/hamzashaebi',
        },
        {
          name: 'sayHello',
          type: 'text',
          defaultValue: 'https://hello.byhamza.xyz/',
        },
      ],
    },
  ],
}
