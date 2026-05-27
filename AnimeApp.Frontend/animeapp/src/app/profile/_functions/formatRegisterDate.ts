export const formatRegisterDate = (iso: string) => {
  const d = new Date(iso);

  return d.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
