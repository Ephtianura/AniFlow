import ReactMarkdown from "react-markdown";

type Props = {
    description?: string | null;
    className?: string;
};

export default function AnimeDescription({ description, className }: Props) {
    if (!description) return null;
    return (
        <div className={`text-primary-black prose prose-invert max-w-none [&_p:last-child]:mb-0!  ${className}`}>
            <ReactMarkdown
                components={{
                    a: ({ node, ...props }) => (
                        <a
                            {...props}
                            className="text-primary hover:text-purple-700 hover:underline"
                        />
                    ),
                    p: ({ node, ...props }) => (
                        <p
                            {...props}
                            className={`mb-4! last:mb-0 line-clamp-18  ${className}`}
                        />
                    ),
                }}
            >
                {description}
            </ReactMarkdown>
        </div>
    );
}