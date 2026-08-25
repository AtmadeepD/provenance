import { MetadataRoute } from 'next';
import { getAllAirlineSlugs } from '@/lib/data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getAllAirlineSlugs();
  const baseUrl = 'https://provenance-register.vercel.app'; // Update to actual domain later

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/airlines`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }
  ];

  slugs.forEach(slug => {
    routes.push({
      url: `${baseUrl}/airlines/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  return routes;
}
