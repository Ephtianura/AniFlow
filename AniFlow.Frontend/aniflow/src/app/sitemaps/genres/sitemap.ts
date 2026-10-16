import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL || "https://aniflow.xyz";

  return [
    {
      url: `${baseUrl}/animes?genres=drama`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/animes?genres=action`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/animes?genres=romance`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}