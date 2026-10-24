import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";
import { cms, skipCmsCache } from "@/lib/cms";
import "@/app/globals.css";

export const revalidate = 86400;

export const viewport: Viewport = {
  viewportFit: 'cover',
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export async function generateMetadata(): Promise<Metadata> {
  let name = siteConfig.name;
  let description = siteConfig.description;
  try {
    const settings = await cms.getSiteSettings();
    if (settings?.name) name = settings.name;
    if (settings?.description) description = settings.description;
  } catch (error) {
    skipCmsCache(error, 'Could not load site settings for metadata:');
  }

  return {
  title: {
    default: name,
    template: `%s | ${name}`,
  },
  description,
  keywords: [
    "Next.js",
    "React",
    "Tailwind CSS",
    "Design Engineer",
    "Portfolio",
    "Hamza Shaebi"
  ],
  authors: [
    {
      name: "Hamza Shaebi",
      url: "https://about.byhamza.xyz",
    },
  ],
  creator: "Hamza Shaebi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: name,
    description,
    siteName: name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: name,
    description,
    images: [siteConfig.ogImage],
    creator: "@hamzashaebi",
  },
  icons: {
    icon: "/favicon.ico",
  },
  };
}

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
