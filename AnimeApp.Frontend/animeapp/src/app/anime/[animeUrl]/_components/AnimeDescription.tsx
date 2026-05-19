import ReactMarkdown from "react-markdown";

type Props = {
    description: string;
};

export default function AnimeDescription({ description }: Props) {
    return (
        <div className='text-primary-black prose prose-invert max-w-none [&_p:last-child]:mb-0!'>
            <ReactMarkdown
                components={{
                    a: ({ node, ...props }) => (
                        <a
                            {...props}
                            className="text-primary hover:text-purple-700 underline"
                        />
                    ),
                    p: ({ node, ...props }) => (
                        <p
                            {...props}
                            className="mb-4! last:mb-0" 
                        />
                    ),
                }}
            >
                {description}
            </ReactMarkdown>
        </div>
    );
}