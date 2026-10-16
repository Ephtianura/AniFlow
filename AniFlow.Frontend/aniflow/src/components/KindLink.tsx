import Link from "next/link";
import { AnimeKindMap } from "@/core/enums/AnimeKind";

type Props = {
  kind?: string;
};

export function KindLink({ kind }: Props) {
  if (!kind) return null;

  return (
    <Link
      href={{ pathname: "/animes", query: { kind } }}
      className="underline hover:text-primary"
    >
      {AnimeKindMap[kind as keyof typeof AnimeKindMap] ?? kind}
    </Link>
  );
}