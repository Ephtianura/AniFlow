import clsx from "clsx";
import Link from "next/link";

type Props = {
  title?: string;
  url: string;
  className?: string;
  newTab?: boolean;
};

export function TitleLink({
  title,
  url,
  className,
  newTab = false,
}: Props) {
  if (!title) return null;

  return (
    <Link
      href={`/anime/${url}`}
      target={newTab ? "_blank" : undefined}
      rel={newTab ? "noopener noreferrer" : undefined}
      className={clsx(
        "text-primary text-xl hover:underline line-clamp-3",
        className
      )}
    >
      {title}
    </Link>
  );
}