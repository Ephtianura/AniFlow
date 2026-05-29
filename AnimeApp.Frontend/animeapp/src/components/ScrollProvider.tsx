"use client";

import { ReactNode } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
//@ts-ignore
import "overlayscrollbars/overlayscrollbars.css";

type Props = {
    children: ReactNode;
};

export default function ScrollProvider({ children }: Props) {
    return (
        <OverlayScrollbarsComponent
            options={{
                scrollbars: {
                    autoHide: "leave",
                    autoHideDelay: 200,
                },
            }}
            className="h-full"
        >
            {children}
        </OverlayScrollbarsComponent>
    );
}