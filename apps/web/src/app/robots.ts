import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/kitchen'],
    },
    sitemap: 'https://provenance-register.vercel.app/sitemap.xml',
  };
}
