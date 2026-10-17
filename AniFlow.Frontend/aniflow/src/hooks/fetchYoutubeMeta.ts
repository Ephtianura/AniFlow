
export const fetchYoutubeMeta = async (videoUrl: string) => {
  try {
    const encodedUrl = encodeURIComponent(videoUrl);
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodedUrl}&format=json`);

    if (!response.ok) throw new Error('Failed to fetch track metadata');

    const data = await response.json();
    return {
      title: data.title.trim() || "Трек",
      author: data.author_name.trim() || "YouTube"
    };
  } catch (error) {
    return {
      title: "Трек",
      author: "YouTube"
    };
  }
};
