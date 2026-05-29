"use client";

import { useEffect, useState } from "react";

export default function Debug500() {
    const [boom, setBoom] = useState(false);

    useEffect(() => {
        if (boom) {
            throw new Error("Client 500 preview");
        }
    }, [boom]);

    return (
        <button onClick={() => setBoom(true)}>
            Trigger 500
        </button>
    );
}