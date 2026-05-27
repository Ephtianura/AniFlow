export const formatWatchTime = (t: string | null) => {
  if (!t) return "0 д. 0 год. 0 хв.";

  const match = t.match(/(?:(\d+)\.)?(\d+):(\d+):(\d+)/);

  if (!match) return t;

  const days = parseInt(match[1] || "0");
  const hours = parseInt(match[2]);
  const minutes = parseInt(match[3]);

  return `${days} д. ${hours} год. ${minutes} хв.`;
};
