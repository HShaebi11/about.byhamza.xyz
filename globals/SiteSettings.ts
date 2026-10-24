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
