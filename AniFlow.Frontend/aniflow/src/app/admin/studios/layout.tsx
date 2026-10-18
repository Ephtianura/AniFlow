import { StudiosNav } from "./_components/StudiosNav";

export default function StudiosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 text-primary text-center">
                Управління cтудіями
            </h1>

            <StudiosNav />

            <hr className="text-hr-clr my-6" />

            {children}
        </div>
    );
}
