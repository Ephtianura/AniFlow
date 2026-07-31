import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.SITE_URL || "https://aniflow.xyz"

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/user/', '/admin/', '/api/'], 
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}