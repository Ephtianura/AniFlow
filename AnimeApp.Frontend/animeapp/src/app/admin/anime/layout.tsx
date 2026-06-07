import React from "react";
import { AnimesNav } from "./_components/AnimesNav";

interface AnimesLayout {
    children: React.ReactNode;
}

export default function AnimesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <h1 className="text-4xl font-extrabold mb-8 text-primary text-center">
                Управління Аніме
            </h1>

            <AnimesNav />

            <hr className="text-hr-clr my-6" />

            {children}
        </div>
    );
}
