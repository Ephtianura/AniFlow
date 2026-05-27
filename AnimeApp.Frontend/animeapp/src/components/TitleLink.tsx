import clsx from "clsx";
import Link from "next/link";

type Props = {
  title?: string;
  url: string;
  className?: string;
};

export function TitleLink({ title, url, className }: Props) {
  if(!title) return null;
   return (
    <Link
      href={`/anime/${url}`}
      className={clsx(
        "text-primary text-xl hover:underline line-clamp-3",
        className
      )}
    >
      {title}
    </Link>
  );
}