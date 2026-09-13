import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL || "https://aniflow.xyz";

  return [
    {
      url: `${baseUrl}/sitemaps/static/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemaps/anime/sitemap.xml`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/sitemaps/genres/sitemap.xml`,
      lastModified: new Date(),
    },
  ];
}