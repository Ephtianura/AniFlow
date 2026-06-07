export const metadata = {
  title: "Каталог аніме | AniFlow",
  description:
    "Великий каталог аніме: нові серії та популярні тайтли українською мовою. Зручні фільтри та перегляд онлайн безкоштовно на AniFlow.",
};

export default function AnimesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="lg:grid grid-cols-[1fr_auto] gap-8 items-start">
      {children}
    </main >
  );
}