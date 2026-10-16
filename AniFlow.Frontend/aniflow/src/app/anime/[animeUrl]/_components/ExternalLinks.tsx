import { ExternalLink } from "@/core/types";
import Link from "next/link";
import { FaGlobe, FaWikipediaW, FaYoutube } from "react-icons/fa6";

type Prop = {
    externalLinks: ExternalLink[]
}

export default function ExternalLinks({ externalLinks }: Prop) {
    if (!externalLinks?.length) return null;

    const visibleLinks = externalLinks
        .filter(link => {
            const url = link.url.toLowerCase();

            return (
                link.text === "Official Site" ||
                url.includes("youtube.com") ||
                url.includes("youtu.be") ||
                url.includes("wikipedia.org")
            );
        })
        .sort((a, b) => {
            const getOrder = (link: ExternalLink) => {
                const url = link.url.toLowerCase();

                if (link.text === "Official Site") return 0;
                if (url.includes("youtube.com") || url.includes("youtu.be")) return 1;
                if (url.includes("wikipedia.org")) return 2;

                return 999;
            };

            return getOrder(a) - getOrder(b);
        });

    return (
        <>
            {externalLinks.length > 0 && (
                <>
                    {/* <p className="text-gray-dark">Посилання</p> */}
                    <div className="flex gap-2 flex-wrap">
                        {visibleLinks.map(link => {
                            const url = link.url.toLowerCase();

                            if (link.text === "Official Site") {
                                return (
                                    <Link
                                        key={link.url}
                                        href={link.url}
                                        target="_blank"
                                        className="btn-white flex items-center gap-2"
                                    >
                                        <FaGlobe className="text-purple-400" />
                                        Official Site
                                    </Link>
                                );
                            }

                            if (url.includes("youtube.com") || url.includes("youtu.be")) {
                                return (
                                    <Link
                                        key={link.url}
                                        href={link.url}
                                        target="_blank"
                                        className="btn-white flex items-center gap-2"
                                    >
                                        <FaYoutube className="text-red-400" />
                                        YouTube
                                    </Link>
                                );
                            }

                            if (url.includes("wikipedia.org")) {
                                return (
                                    <Link
                                        key={link.url}
                                        href={link.url}
                                        target="_blank"
                                        className="btn-white flex items-center gap-2"
                                    >
                                        <FaWikipediaW />
                                        Wikipedia
                                    </Link>
                                );
                            }

                            return null;
                        })}
                    </div>
                </>
            )}

        </>
    );
}