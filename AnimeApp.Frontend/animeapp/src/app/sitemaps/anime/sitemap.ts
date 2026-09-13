import { getAnimeSitemap } from "@/hooks/getAnimeSitemap";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.SITE_URL || "https://aniflow.xyz";
  const animes = await getAnimeSitemap();

  return animes.map((anime) => ({
    url: `${baseUrl}/anime/${anime.url}`,
    lastModified: new Date(anime.updatedAt),
    changeFrequency: "daily",
    priority: 0.8,
    images: anime.posterUrl ? [anime.posterUrl] : [],
  }));
}