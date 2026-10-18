import { GenresNav } from "./_components/GenresNav";

export default function GenresLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 text-primary text-center">
                Управління жанрами
            </h1>

            <GenresNav />

            <hr className="text-hr-clr my-6" />

            {children}
        </div>
    );
}
