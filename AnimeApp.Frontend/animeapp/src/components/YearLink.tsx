import Link from "next/link";

type Props = {
  year?: number;
};

export function YearLink({ year }: Props) {
  if (!year) return null;

  return (
    <Link
      href={{ pathname: "/animes", query: { year: year } }}
      className="underline hover:text-primary"
    >
      {year}
    </Link>
  );
}